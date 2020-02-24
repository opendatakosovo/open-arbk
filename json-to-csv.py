import csv
import json
import datetime
import os


def ownerGender(gender, lang):
    if lang == "sq":
        if gender == 'male':
            return 'Mashkull'
        elif gender == 'female':
            return 'Fem'u'\xeb''r'
        else:
            return 'Panjohur'
    else:
        return gender.title()

with open('activities.json','r') as activitiesJson:
    readActivities = activitiesJson.read()
    allActivitiesSq = json.loads(readActivities)
with open('activities_en.json','r') as activitiesJson:
    readActivities = activitiesJson.read()
    allActivitiesEn = json.loads(readActivities)

for root, dirs, files in os.walk("."):  
    for filename in files:
        if "(sq).json" in filename or "(sq)(pakompletuar).json" in filename or "(en).json" in filename or "(en)(uncomplete).json" in filename:
            with open(filename[:-5]+'.json', 'rb') as infile, open(filename[:-5]+'.csv', 'wb') as outfile:
                if "(en)" in filename:
                    lang = 'en'
                    fieldnames = ['Name of Business', 
                    'Status', 
                    'Fiscal number', 
                    'Business type',
                    'Capital',
                    'Number of employees',
                    'Owners',
                    'Owners Gender',
                    'Authorized Persons',
                    'Date of establishment',
                    'Date of application',
                    'Link of ARBK',
                    'Registration number',
                    'Municipality',
                    'Activities',
                    'Date of data retrievement']
                else:
                    lang = 'sq'
                    fieldnames = ['Emri i biznesit', 
                    'Statusi', 
                    'Numri fiskal', 
                    'Tipi i biznesit',
                    'Kapitali',
                    'Numri i pun'u'\xeb''tor'u'\xeb''ve'.encode('utf-8'),
                    'Pronar'u'\xeb'''.encode('utf-8'),
                    'Gjinia e pronarit',
                    'Personat e autorizuar',
                    'Data e fillimit',
                    'Data e aplikimit',
                    'Linku n'u'\xeb'' ARBK'.encode('utf-8'),
                    'Numri i regjistrimit',
                    'Komuna',
                    'Aktivitetet',
                    'Data e marrjes s'u'\xeb'' t'u'\xeb'' dh'u'\xeb''nave'.encode('utf-8')
                    ]
                writer = csv.DictWriter(outfile, fieldnames)
                writer.writeheader()
                print filename
                rows = json.load(infile)
                for index,row in enumerate(rows):
                    name = ''
                    gender = ''
                    authorized = ''
                    activities = ''
                    status = ''
                    
                    try:
                        establishmentDate = datetime.datetime.fromtimestamp(row['establishmentDate']['$date']/1000.0).strftime('%Y-%m-%d')
                    except TypeError:
                        establishmentDate = ""
                    except ValueError:
                        establishmentDate = ""
                    try:
                        applicationDate = datetime.datetime.fromtimestamp(row['applicationDate']['$date']/1000.0).strftime('%Y-%m-%d')
                    except TypeError:
                        applicationDate = ""    
                    try:
                        dataRetrieved = datetime.datetime.fromtimestamp(row['dataRetrieved']['$date']/1000.0).strftime('%Y-%m-%d')
                    except TypeError:
                        dataRetrieved = "" 
                    try:
                        status = row['status']['%s'%lang].encode('utf-8')
                    except TypeError:
                        status = ""
                    for index,owner in enumerate(row['owners']):
                        try:
                            name += owner['name'].encode('utf-8')
                            if(index < len(row['owners']) -1):
                                name+=",\n"
                        except IndexError:
                            name = ""
                        try:
                            gender += ownerGender(owner['gender'], lang).encode('utf-8')
                            if(index < len(row['owners']) - 1):
                                gender+=",\n"
                        except IndexError:
                            gender = ""
                    for index,auth in enumerate(row['authorized']):
                        try:
                            authorized += auth['name'].encode('utf-8')
                            if(index < len(row['authorized']) - 1):
                                authorized+=",\n"
                        except IndexError:
                            authorized = ""
                    for index,activity in enumerate(row['activities']):
                        try:
                            if lang == "sq":
                                activities += allActivitiesSq[str(activity)].encode('utf-8')
                            else:
                                activities += allActivitiesEn[str(activity)].encode('utf-8')
                            if(index < len(row['activities']) - 1):
                                activities+=",\n"
                        except IndexError:
                            activities += ""
                        except KeyError:
                            print "KeyError"
                            activities += ""
                    if "(sq)" in filename:
                        writer.writerow({'Emri i biznesit': row['name'].encode('utf-8'),
                                'Statusi': status,
                                'Numri fiskal': row['fiscalNum'],
                                'Tipi i biznesit': row['type']['sq'].encode('utf-8'),
                                'Kapitali': row['capital'],
                                'Numri i pun'u'\xeb''tor'u'\xeb''ve'.encode('utf-8'): row['employeeCount'],
                                'Pronar'u'\xeb'''.encode('utf-8'): name,
                                'Gjinia e pronarit':gender,
                                'Personat e autorizuar': authorized,
                                'Data e fillimit': establishmentDate,
                                'Data e aplikimit': applicationDate,
                                'Linku n'u'\xeb'' ARBK'.encode('utf-8'): row['arbkUrl'].encode('utf-8'),
                                'Numri i regjistrimit': row['registrationNum'],
                                'Komuna': row['municipality']['municipality']['sq'].encode('utf-8'),
                                'Aktivitetet': activities,
                                'Data e marrjes s'u'\xeb'' t'u'\xeb'' dh'u'\xeb''nave'.encode('utf-8'): dataRetrieved
                                })
                    else:
                        writer.writerow({'Name of Business': row['name'].encode('utf-8'),
                                    'Status': status,
                                    'Fiscal number': row['fiscalNum'],
                                    'Business type': row['type']['en'].encode('utf-8'),
                                    'Capital': row['capital'],
                                    'Number of employees': row['employeeCount'],
                                    'Owners': name,
                                    'Owners Gender':gender,
                                    'Authorized Persons': authorized,
                                    'Date of establishment': establishmentDate,
                                    'Date of application': applicationDate,
                                    'Link of ARBK': row['arbkUrl'].encode('utf-8'),
                                    'Registration number': row['registrationNum'],
                                    'Municipality': row['municipality']['municipality']['en'].encode('utf-8'),
                                    'Activities': activities,
                                    'Date of data retrievement': dataRetrieved
                                    })
