from selenium import webdriver
from bs4 import BeautifulSoup
import json
import re
import sys
import getopt

languageSlokam = 'SAN'
languageMeaning = 'ENG'

HOME_PAGE_URL = 'http://www.valmikiramayan.net/'
KANDAS = ['baala', 'ayodhya', 'aranya', 'kish', 'sundara', 'yuddha']
KANDA_PAGES = ['bala', 'ayodhya', 'aranya', 'kishkindha', 'sundara', 'yuddha']
KANDA_URL_TEMPLATE = 'utf8/${kanda}/'
SARGA_URL_TEMPLATE = 'sarga${sargaNum}/'
SARGA_PAGE_URLTEMPLATE = '${kanda}sans${sargaNum}.htm'


def run(url=None, driver_location="/usr/local/bin/chromedriver",
        headless='True', out_dir='./data/valmiki_ramayan',
        category_type="God", page_type="Stotram", content_type="Slokam"):

    # make the browser work in background
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("headless")

    # initiate browser driver
    driver = webdriver.Chrome(
        driver_location if driver_location else "/usr/local/bin/chromedriver", options=options)

    try:
        kanda_index = 0
        for kanda in KANDAS:
            url = HOME_PAGE_URL + KANDA_URL_TEMPLATE.replace('${kanda}', kanda)
            for sarga in range(1, 150):
                done_sarga = True
                done_sarga = scrape_sarga(driver=driver, base_url=url, out_dir=out_dir,
                                          kanda_index=kanda_index, sarga_index=sarga)
                if not done_sarga:
                    break
            kanda_index += 1

        # testing individual sarga
        # url = HOME_PAGE_URL + KANDA_URL_TEMPLATE.replace('${kanda}', KANDAS[0])
        # done_sarga = scrape_sarga(driver=driver, base_url=url, out_dir=out_dir,
        #                           kanda_index=0, sarga_index=18)
    finally:
        driver.quit()


def scrape_sarga(driver=None, base_url=None, out_dir=None, kanda_index=None, sarga_index=None):
    sarga_base_url = base_url + \
        SARGA_URL_TEMPLATE.replace('${sargaNum}', str(sarga_index))
    page_url = sarga_base_url + SARGA_PAGE_URLTEMPLATE.replace(
        '${kanda}', KANDA_PAGES[kanda_index]).replace('${sargaNum}', str(sarga_index))

    # go to the page
    driver.get(page_url)
    print(
        f'scraping kanda: {KANDAS[kanda_index]}, sarga: {sarga_index}: {page_url}')

    soup = BeautifulSoup(driver.page_source, features="html.parser").body

    if soup.h1:
        firstH1 = soup.h1.text
        if firstH1 == 'Not Found':
            return False

    outData = {}

    intro = soup.find('p', class_='txt', recursive=False)
    if intro:
        outData['intro'] = intro.text

    titles = [title for title in soup.h3.stripped_strings]
    # print([title for title in titles])
    kandaTitle = titles[0].split(':')[-1:][0]
    kandaTitles = kandaTitle.split('-')

    outData['source'] = page_url
    outData['kandaTitle'] = kandaTitles[0].strip().replace('\n', '')
    outData['kandaDescription'] = kandaTitles[-1:][0].strip()

    outData['sargaTitle'] = titles[1] if len(
        titles) > 1 else 'Sarga ' + str(sarga_index)

    slokas = []

    verce_locators = soup.find_all(
        'p', class_='verloc')

    sloka_index = 0
    for verce_locator in verce_locators:
        sloka_index += 1
        # print(f'slokam: {sloka_index}')
        slokam = {}
        try:
            if verce_locator.next_sibling['href'] == '#VerseLocator':
                sloka = verce_locator.next_sibling.p
            else:
                sloka = verce_locator.find_next_sibling('p', class_='SanSloka')
        except Exception:
            sloka = verce_locator.find_next_sibling('p', class_='SanSloka')

        if sloka and sloka.audio:
            slokam['audio'] = sloka.audio.source['src']
        elif sloka and sloka.object:
            slokam['audio'] = sloka.object['data'].split('=')[-1:][0]
        else:
            slokam['audio'] = ''

        if slokam['audio']:
            sloka = sloka.find_next_sibling('p', class_='SanSloka')

        try:
            if not slokam['audio']:  # try with mejs-controls
                audioCtrl = verce_locator.find_next_sibling(
                    'div', class_='mejs-audio')
                if audioCtrl:
                    slokam['audio'] = audioCtrl.find('audio')['src']
        except Exception:
            slokam['audio'] = ''

        if not sloka:
            if verce_locator.next_sibling.name == 'em':
                sloka = verce_locator.next_sibling.p
                print(
                    f'going deep @{sloka_index} sub element "em" found')
            else:
                print(f'skipping @{sloka_index} few elements as new subelement found ',
                      verce_locator.next_sibling.name)
                break

        slokam['slokam'] = sloka.text.strip()
        if len(slokam['slokam']) == 0:
            sloka = sloka.find_next_sibling('p', class_='SanSloka')
            slokam['slokam'] = sloka.text.strip()

        pratipada = sloka.find_next_sibling('p', class_='pratipada')
        if pratipada:
            slokam['prati_pada_artham'] = pratipada.text.strip()

        tat = sloka.find_next_sibling('p', class_='tat')
        if tat:
            slokam['tatparyam'] = tat.text.strip()

        slokas.append(slokam)

        sloka = sloka.find_next_sibling('p', class_='SanSloka')
        # break  # for testing only

    outData["contents"] = slokas

    fileName = KANDAS[kanda_index] + '_sarga_' + str(sarga_index)
    outFile = out_dir + '/' + fileName + '.json'

    print('writing to file: ', outFile)
    with open(outFile, 'w', encoding='utf8') as f:
        json.dump(outData, f, ensure_ascii=False)
        f.close()

    print(f'Scraping Done: Sarga: ${sarga_index}')
    return True
    # print(postContents)


# usage
# $> python scrape_valmiki_ramayan.net.py -o "./data/valmiki_ramayan"
if __name__ == "__main__":
    prgOrgs = {
        'out_dir': '',
        'url': '',
        'headless': True,
        'category_type': None,
        'page_type': None,
        'content_type': None
    }

    try:
        opts, args = getopt.getopt(sys.argv[1:], "ho:f", [
                                   "out-dir=", "foreground"])
    except getopt.GetoptError:
        print('scrape_valmiki_ramayan.net.py -o <output-dir> ')
        sys.exit(2)

    for opt, arg in opts:
        if opt == '-h':
            print('scrape_valmiki_ramayan.net.py -o <output-dir> ')
            sys.exit()
        elif opt in ("-o", "--out-dir"):
            prgOrgs['out_dir'] = arg
            if not prgOrgs['out_dir']:
                print('missing destination directory using current location')
                prgOrgs['out_dir'] = './'
        elif opt in ("-f", "--foreground"):
            prgOrgs['headless'] = False

    run(**prgOrgs)
