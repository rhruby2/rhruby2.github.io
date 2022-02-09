import re
import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
import json

#VS Code multiline comment: [CTRL][/]

#TODO save dicovered links to view

def getRawFile():
    rawFile = 'eldritchInnvocationsArticle.html'
    url = 'http://dnd5e.wikidot.com/warlock%3Aeldritch-invocations'

    # call url request once and save as file
    try:
        handler = open(rawFile, "r")
        
        print('raw file exists')
        handler.close()
    except:
        print('raw file does not exist, creating new html file')
        
        html = urllib.request.urlopen(url).read()
        soup = BeautifulSoup(html, 'html.parser')
        #saving file
        print(soup.prettify(), file=open(rawFile, 'a', encoding="utf-8"))

    return rawFile
    
with open(getRawFile(),'r', encoding="utf-8") as fp:
    soup = BeautifulSoup(fp, 'html.parser')

eiPageContent = soup.find(id='page-content').find('div','col-lg-12')

eiDict = {'Eldritch Innvocations': []}

def getPreRequisites(tag):
    #PREREQ: level OR pact OR spell
    level = ''
    pact = ''
    misc = ''

    prereq = tag.find('em').get_text().strip().replace('\n','').replace('-', ' ').replace(',',' ,').replace('Prerequisite: ', '')
    prereqCleaned = re.sub(' +', ' ', prereq).split(',')
    #print(prereqCleaned)

    for pr in prereqCleaned:
        if 'level' in pr:
            #keep only numbers and remove placement suffixes
            #EX: '5th level' -> '5'
            level = pr.split(' ')[0][ : -2 ]

        elif 'Pact' in pr:
            pact = pr

        else:
            misc = pr

    #print('     ', level, pact, misc)

    return {
        'Level':level,
        'Pact':pact,
        'Other':misc
    }

def getDescription(tag):
    descriptionList = []
    descriptionStr = ''
    #remove prerequisite section
    if(tag.find('strong')):
        tag.strong.extract()

    if(tag.find('br')):
        tag.br.extract()
    #keep any links as text only
    if(tag.find('a')):
        tag.a.unwrap()

    #cleaning whitespace
    descriptionList.append(re.sub(' +', ' ', tag.get_text().replace('\n','')).strip())

    #find more sibling <p> to include
    #go until next h2 section
    #skipping over string lines
    section = tag.next_sibling.next_sibling
    while section is not None and section.name != 'h2':
        if(section.name == 'p' or section.name == 'ul'):
            if(section.find('a')):
                section.a.unwrap()
            descriptionList.append(re.sub(' +', ' ', section.get_text().replace('\n','')).strip())

        #ending case
        if(section.next_sibling.next_sibling is None):
            break

        section = section.next_sibling.next_sibling

    descriptionStr = '\n\n'.join(descriptionList)
    print(descriptionStr)
    return descriptionStr

#Eldritch Innvocations start with id=toc0, after id=toc section
for sibling in eiPageContent.find(id='toc').next_siblings:
    if(sibling.name == 'h2'):
        # NAME #
        ei_name = sibling.get_text().strip()
        print(ei_name)
        
        desc_html = sibling.find_next_sibling()

        eiDict['Eldritch Innvocations'].append({
            'Name': ei_name,
            'Prerequisites': getPreRequisites(desc_html) if(desc_html.find('em')) else {},
            'Description': getDescription(desc_html) 
        })
        print(' ')

#print(eiDict)

def saveToJSON(eiDict):
    fileName = 'eldritchInnvocations.json'
    eiDictJSON = json.dumps(eiDict, indent = 4)

    with open(fileName,'w') as outfile:
        outfile.write(eiDictJSON)

saveToJSON(eiDict)
