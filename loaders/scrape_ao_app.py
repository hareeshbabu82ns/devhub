from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from bs4 import BeautifulSoup


# make the browser work in background
options = webdriver.ChromeOptions()
# options.add_argument("headless")

# initiate browser driver
driver = webdriver.Chrome("/usr/local/bin/chromedriver", options=options)
driver.implicitly_wait(10)

pagePortal = 'http://coresapsbx001.atb.ab.com:50600/irj/portal'
driver.get(pagePortal)
# dirver.send_keys('')
userName = driver.find_element_by_name("j_username")
userName.send_keys('C41011')
pwdField = driver.find_element_by_name("j_password")
pwdField.send_keys('SriHari27')
pwdField.send_keys(Keys.RETURN)

driver.get('http://coresapsbx002.atb.ab.com:8002/sap/bc/webdynpro/atb/aowdaccountorigination?sap-wd-configid=%2fATB%2fAO_NON_RETAIL&sap-client=510&sap-language=EN&sap-ie=EDGE&AO_KEY=5EF0E80714E65BF0E10080000A803886&saprole=ZSALESPRO#')

unlockBtn = driver.find_element_by_css_selector('#WD2D.urBtnStd')
if unlockBtn:
    print('found unlock btn')
    unlockBtn.click()
# role='button' title='Application'
applicationBtn = driver.find_element_by_xpath(
    "//a[@role='button'][@title='Application']")
if applicationBtn:
    print('found application btn')
    applicationBtn.click()
# driver.quit()
