from bs4 import BeautifulSoup

with open('test.html') as fp: 
    soup = BeautifulSoup(fp, 'html.parser')

