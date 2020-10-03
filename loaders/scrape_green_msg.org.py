from selenium import webdriver
from bs4 import BeautifulSoup
import json
import re
import sys
import getopt

languageMap = {'te': 'TEL', 'en-IN': 'IAST', 'hi-IN': 'SAN', 'ta': 'TAM'}
languagesDesired = ['telugu', 'hindi', 'english']


def get_page_content(driver=None, pageHref=None):
    print('scraping : ', pageHref)
    driver.get(pageHref)

    soup = BeautifulSoup(driver.page_source, features="html.parser")

    # find content for each link
    postContent = soup.find('div', attrs={'class': 'entry-inner'})

    postCategory = soup.find('li', class_='category').text
    postCategory = postCategory.split('/')[-1:][0]
    postCategory = postCategory.split('-')[-1:][0].strip()

    pageLanguage = languageMap.get(soup.find('html')['lang'])

    postTitle = soup.find('h1', attrs={'class': 'post-title entry-title'}).text
    postTitle = postTitle.split('–')[1].strip()

    postContents = postContent.find_all('p', recursive=False)[1:]

    # print(postCategory)
    # print(postTitle.text)
    # print([p.text for p in postContents])
    outData = {
        'language': pageLanguage,
        'title': postTitle,
        'category': postCategory,
        'source': pageHref,
        'contents': [p.text for p in postContents]
    }

    return outData


def run(url=None, driver_location="/usr/local/bin/chromedriver",
        headless='True', out_dir='./data',
        category_type="God", page_type="Stotram", content_type="Slokam"):

    # make the browser work in background
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("headless")

    # initiate browser driver
    driver = webdriver.Chrome(
        driver_location if driver_location else "/usr/local/bin/chromedriver", options=options)

    try:
        # go to the page
        driver.get(url)

        soup = BeautifulSoup(driver.page_source, features="html.parser")

        print('scraping done')
        # print(postContents)
    finally:
        driver.quit()


# usage
# $> python scrape_stotra_nidhi.py -o "./data" -u "https://page-to-scrape/path/"
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
        opts, args = getopt.getopt(sys.argv[1:], "ho:u:ft:p:c:", [
                                   "out-dir=", "url=", "foreground", "category-type=", "page-type=", "content-type="])
    except getopt.GetoptError:
        print('scrape_stotra_nidhi.py -o <output-dir> -u <url>')
        sys.exit(2)

    for opt, arg in opts:
        if opt == '-h':
            print('scrape_stotra_nidhi.py -o <output-dir> -u <url>')
            sys.exit()
        elif opt in ("-u", "--url"):
            prgOrgs['url'] = arg
            if not prgOrgs['url']:
                print('missing url server url')
                sys.exit(2)
        elif opt in ("-o", "--out-dir"):
            prgOrgs['out_dir'] = arg
            if not prgOrgs['out_dir']:
                print('missing destination directory using current location')
                prgOrgs['out_dir'] = './'
        elif opt in ("-f", "--foreground"):
            prgOrgs['headless'] = False
        elif opt in ("-t", "--category-type"):
            prgOrgs['category_type'] = arg
        elif opt in ("-p", "--page-type"):
            prgOrgs['page_type'] = arg
        elif opt in ("-c", "--content-type"):
            prgOrgs['content_type'] = arg

    run(**prgOrgs)
