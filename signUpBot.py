from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
import time
from datetime import datetime



driver = webdriver.Chrome()

driver.get("https://www.buchsys.ahs.tu-dortmund.de/angebote/aktueller_zeitraum/_Badminton.html")

#function to sign up for an appointment
def signIn(path): #path is the XPATH of the book button that macht the day of week
    
    #choose the offer of the same weekday next week
    bookBut = driver.find_element(By.XPATH, path)
    bookBut.click()

    #choose to sign up with account
    driver.switch_to.window(driver.window_handles[1])
    bookBut1 = driver.find_element(By.XPATH, '//*[@id="bs_form_main"]/div/div[2]/div[1]/label/div[2]/input')
    bookBut1.click()
    signUpBut = driver.find_element(By.XPATH, '//*[@id="bs_pw_anmlink"]/div[2]')
    signUpBut.click()
    
    #fill in the register form 
    eMail = driver.find_element(By.XPATH, '//*[@id="bs_pw_anm"]/div[2]/div[2]/input')
    eMail.send_keys("abc@def.com") # ENTER YOUR USERNAME HERE
    password = driver.find_element(By.XPATH, '//*[@id="bs_pw_anm"]/div[3]/div[2]/input')
    password.send_keys("123456789") # ENTER YOUR PASSWORD HERE
    submit = driver.find_element(By.XPATH, '//*[@id="bs_pw_anm"]/div[5]/div[1]/div[2]/input')
    WebDriverWait(driver, 22).until(EC.element_to_be_clickable((By.XPATH, '//*[@id="bs_pw_anm"]/div[5]/div[1]/div[2]/input')))
    submit.click()

    #final check of the infos
    checkBox = driver.find_element(By.XPATH, '//*[@id="bs_bed"]/label/input')
    checkBox.click()
    confirm = driver.find_element(By.XPATH, '//*[@id="bs_submit"]')
    confirm.click()

    #submit the register form
    booking = driver.find_element(By.XPATH, '//*[@id="bs_foot"]/div[1]/div[2]/input')
    booking.click()


match datetime.now().weekday(): # get day of the week
    case 0: #monday
        try:
            signIn('//*[@id="bs_tr2203EF9F6C"]/td[9]/input')
        except:
            driver.quit()
    case 1:
        try:
            signIn('//*[@id="bs_tr2203EF9FD2"]/td[9]/input')
        except:
            driver.quit()
    case 3:
        try:
            signIn('//*[@id="bs_tr2203EF9F79"]/td[9]/input')
        except:
            driver.quit()
    case 4:
        try:
            signIn('//*[@id="bs_tr2203EF9F67"]/td[9]/input')
        except:
            driver.quit()
    case _:
        driver.quit()

driver.quit()



