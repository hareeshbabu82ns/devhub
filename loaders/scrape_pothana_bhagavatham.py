from selenium import webdriver
from bs4 import BeautifulSoup
import json
import re
import sys
import getopt

languageSlokam = 'SAN'
languageMeaning = 'ENG'

HOME_PAGE_URL = 'http://telugubhagavatam.org/?tebha'
SKANDAS = ['1', '2', '3', '4', '5.1', '5.2', '6',
           '7', '8', '9', '10.1', '10.2', '11', '12']
# SKANDA_PAGES = ['bala', 'ayodhya', 'aranya', 'kishkindha', 'sundara', 'yuddha']
# GHATTAS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 92, 20, 14]
GHATTAS = [42, 37, 58, 29, 17, 9, 18, 18, 94, 55, 199, 92, 20, 14]
SKANDA_URL_TEMPLATE = '&Skanda=${skanda}'
GHATTA_URL_TEMPLATE = '&Ghatta=${ghatta}'
# GHATTA_PAGE_URLTEMPLATE = '?tebha&'+SKANDA_URL_TEMPLATE+'&'+GHATTA_URL_TEMPLATE'


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
        for skanda in SKANDAS:
            url = HOME_PAGE_URL + \
                SKANDA_URL_TEMPLATE.replace('${skanda}', skanda)
            # GHATTAS[kanda_index]
            for ghatta in range(0, GHATTAS[kanda_index]-1):
                done_sarga = True
                done_sarga = scrape_sarga(driver=driver, base_url=url, out_dir=out_dir,
                                          kanda_index=kanda_index, sarga_index=ghatta+1)
                if not done_sarga:
                    break
            kanda_index += 1

        # testing individual ghatta
        # url = HOME_PAGE_URL + \
        #     SKANDA_URL_TEMPLATE.replace('${skanda}', '1')
        # done_sarga = scrape_sarga(driver=driver, base_url=url, out_dir=out_dir,
        #                           kanda_index=0, sarga_index=1)
    finally:
        driver.quit()


def scrape_sarga(driver=None, base_url=None, out_dir=None, kanda_index=None, sarga_index=None):
    sarga_base_url = base_url + \
        GHATTA_URL_TEMPLATE.replace('${ghatta}', str(sarga_index))
    # page_url = sarga_base_url + GHATTA_PAGE_URLTEMPLATE.replace(
    #     '${skanda}', SKANDA_PAGES[kanda_index]).replace('${ghatta}', str(sarga_index))
    page_url = sarga_base_url

    # go to the page
    driver.get(page_url)
    print(
        f'scraping skanda: {SKANDAS[kanda_index]}, ghatta: {sarga_index}: {page_url}')

    soup = BeautifulSoup(driver.page_source, features="html.parser").body

    page_title = f'skandam_{kanda_index}_ghattam_{sarga_index}'

    outData = {}

    titles = [title for title in soup.h2.stripped_strings]
    if len(titles) == 0:
        return True

    # print([title for title in titles])
    kandaTitle = titles[0].split(':')[0]
    kandaTitles = kandaTitle.split('-')

    outData['source'] = page_url
    outData['kandaTitle'] = kandaTitles[0].strip().replace('\n', '')
    outData['kandaDescription'] = kandaTitles[-1:][0].strip()

    outData['sargaTitle'] = titles[1] if len(
        titles) > 1 else 'Sarga ' + str(sarga_index)

    slokas = []

    verce_locators = soup.find_all(
        'p', class_='padyam')

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
        except:
            sloka = verce_locator

        if sloka and sloka.audio:
            slokam['audio'] = sloka.audio.source['src']
        elif sloka and sloka.object:
            slokam['audio'] = sloka.object['data'].split('=')[-1:][0]
        else:
            slokam['audio'] = ''

        try:
            if not slokam['audio']:  # try with mejs-controls
                audioCtrl = verce_locator.find_next_sibling(
                    'div', class_='mejs-audio')
                if audioCtrl:
                    slokam['audio'] = audioCtrl.find('audio')['src']
        except:
            slokam['audio'] = ''

        # if not sloka:
        #     if verce_locator.next_sibling.name == 'em':
        #         sloka = verce_locator.next_sibling.p
        #         print(
        #             f'going deep @{sloka_index} sub element "em" found')
        #     else:
        #         print(f'skipping @{sloka_index} few elements as new subelement found ',
        #               verce_locator.next_sibling.name)
        #         break

        for content in sloka.contents:
            if content.name == 'audio':
                content.replace_with('')
            elif content.name == 'br':
                content.replace_with('\n')
            elif content.name == 'a':
                content.replace_with('')

        slokam['slokam'] = sloka.text.strip()

        if len(slokam['slokam']) == 0:
            sloka = sloka.find_next_sibling('p')

            for content in sloka.contents:
                if content.name == 'audio':
                    content.replace_with('')
                elif content.name == 'br':
                    content.replace_with('\n')
                elif content.name == 'a':
                    content.replace_with('')

            slokam['slokam'] = sloka.text.strip()

        pratipada = sloka.find_next_sibling('p', class_='teeka')
        if pratipada:
            slokam['prati_pada_artham'] = pratipada.text.strip()

        tat = sloka.find_next_sibling('p', class_='meaning')
        if tat:
            slokam['tatparyam'] = tat.text.strip()

        slokas.append(slokam)

        # break  # for testing only

    outData["contents"] = slokas

    # fileName = SKANDAS[kanda_index] + '_sarga_' + str(sarga_index)
    fileName = f'skandam_{SKANDAS[kanda_index]}_ghattam_{sarga_index}'
    # fileName = page_title
    outFile = out_dir + '/' + fileName + '.json'

    print('writing to file: ', outFile)
    with open(outFile, 'w', encoding='utf8') as f:
        json.dump(outData, f, ensure_ascii=False)
        f.close()

    print(f'Scraping Done: Sarga: {sarga_index}')
    return True
    # print(postContents)


# usage
# $> python scrape_valmiki_ramayan.net.py -o "./data/valmiki_ramayan"
if __name__ == "__main__":
    prgOrgs = {
        'out_dir': './data/pothana_bhagavatham',
        'url': '',
        'headless': True,
        'category_type': None,
        'page_type': None,
        'content_type': None
    }

    try:
        opts, args = getopt.getopt(sys.argv[1:], "ho:f", [
                                   "out-dir=",  "foreground"])
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
