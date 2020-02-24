from pymongo import MongoClient
import os, os.path, re, json, datetime, sys, csv, time, subprocess, shutil, zipfile
from bson import json_util
from cStringIO import StringIO
reload(sys)
sys.setdefaultencoding('utf-8')

client = MongoClient("mongodb://localhost:27017")
db = client['arbk']

if not os.path.exists('app/static/downloads'):
    try:
        print 'creating downloads folder'
        os.makedirs('app/static/downloads')
    except OSError as exc: # Guard against race condition
        if exc.errno != errno.EEXIST:
            raise

def gender_sq(gender):
    if gender == 'male':
        return 'Mashkull'
    elif gender == 'female':
        return 'Fem'u'\xeb''r'
    else:
        return 'Panjohur'

# DOWNLOADS
def download_biz_by_year(type_of_date,year):
    result = db.reg_businesses.find(
        {type_of_date:
            {"$gt": datetime.datetime(year, 1, 1),
             "$lte": datetime.datetime(year+1, 1, 1)}}, no_cursor_timeout=True)
    return result

def set_name_to_activities(given_code, lang):
    activities_collection =db.activities.find()
    name = ''
    for activity in activities_collection:
        if str(given_code) == activity['code']:
            name = activity['activity'][lang]
        else:
            continue
    return name

def make_json_sq(download_dir, range_download_year, type_of_date):
    for year in range_download_year:
        print 'creating %s documents albanian: arbk-%s.json'%(type_of_date, year)
        if year == 2017:
            if type_of_date == "applicationDate":
                filename_json = '%s/arbk-%s(dataAplikimit)(sq)(pakompletuar).json'%(download_dir, year)
            else:
                filename_json = '%s/arbk-%s(dataFillimit)(sq)(pakompletuar).json'%(download_dir, year)
        else:
            if type_of_date == "applicationDate":
                filename_json = '%s/arbk-%s(dataAplikimit)(sq).json'%(download_dir, year)
            else:
                filename_json = '%s/arbk-%s(dataFillimit)(sq).json'%(download_dir, year)
        if os.path.isfile(filename_json):
            print 'json exitsts: %s' % filename_json
        else:
            cursor = download_biz_by_year(type_of_date,year)
            with open(filename_json, 'w') as jsonfile:
                jsonfile.write(json_util.dumps(cursor))

def make_json_en(download_dir, range_download_year, type_of_date):
    for year in range_download_year:
        print 'creating %s documents english: arbk-%s.json'%(type_of_date, year)
        if year == 2017:
            if type_of_date == "applicationDate":
                filename_json = '%s/arbk-%s(applicationDate)(en)(uncomplete).json'%(download_dir, year)
            else:
                filename_json = '%s/arbk-%s(establishmentDate)(en)(uncomplete).json'%(download_dir, year)
        else:
            if type_of_date == "applicationDate":
                filename_json = '%s/arbk-%s(applicationDate)(en).json'%(download_dir, year)
            else:
                filename_json = '%s/arbk-%s(establishmentDate)(en).json'%(download_dir, year)
        if os.path.isfile(filename_json):
            print 'json exitsts: %s' % filename_json
        else:
            cursor = download_biz_by_year(type_of_date,year)
            with open(filename_json, 'w') as jsonfile:
                jsonfile.write(json_util.dumps(cursor))

def make_csv_sq(download_dir, range_download_year, type_of_date):
    for year in range_download_year:
        print 'creating %s documents albanian: arbk-%s.csv'%(type_of_date, year)
        if year == 2017:
            if type_of_date == "applicationDate":
                filename_csv = '%s/arbk-%s(dataAplikimit)(sq)(pakompletuar).csv'%(download_dir, year)
            else:
                filename_csv = '%s/arbk-%s(dataFillimit)(sq)(pakompletuar).csv'%(download_dir, year)
        else:
            if type_of_date == "applicationDate":
                filename_csv = '%s/arbk-%s(dataAplikimit)(sq).csv'%(download_dir, year)
            else:
                filename_csv = '%s/arbk-%s(dataFillimit)(sq).csv'%(download_dir, year)
        if os.path.isfile(filename_csv):
            print 'csv exitsts: %s' % filename_csv
        else:
            cursor = download_biz_by_year(type_of_date,year)
            with open(filename_csv, 'w') as csvfile:
                fieldnames = ['Emri i biznesit', 'Statusi', 'Numri fiskal','Tipi i biznesit', 'Numri i pun'u'\xeb''tor'u'\xeb''ve','Kapitali', 'Pronar'u'\xeb''', 'Gjinia e pronarit', 'Personat e autorizuar','Data e fillimit','Data e aplikimit', 'Linku n'u'\xeb'' arbk', 'Numri i regjistrimit', 'Komuna', 'Aktivitetet', 'Data e marrjes s'u'\xeb'' t'u'\xeb'' dh'u'\xeb''nave']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for doc in cursor:
                    acts = ''
                    owners = ''
                    ownersGender = ''
                    authorized = ''
                    status = ""         
                    try:
                        status = doc['status']['sq']
                    except Exception as e:
                        status = ""
                    for i in doc['activities']:
                        dc = set_name_to_activities(i,'sq')
                        if len(doc['activities']) > 1:
                            acts += '%s-%s |\n'%(str(i),dc.encode('utf-8'))
                        else:
                            acts += '%s-%s\n'%(str(i),dc.encode('utf-8'))
                    for owner in doc['owners']:
                        
                        if len(doc['owners']) > 1:
                            owners += '%s,\n'%owner['name'].encode('utf-8')
                            ownersGender += '%s,\n'%gender_sq(owner['gender'])
                            
                        else:
                            owners += '%s\n'%owner['name'].encode('utf-8')
                            ownersGender += '%s\n'%gender_sq(owner['gender'])
                    for auth in doc['authorized']:
                        if len(doc['owners']) > 1:
                            authorized += '%s,\n'%auth['name'].encode('utf-8')
                        else:
                            authorized += '%s\n'%auth['name'].encode('utf-8')
                    try:
                        estDate = doc['establishmentDate'].date()
                    except Exception as e:
                        estDate = ""
                    row = {'Emri i biznesit': doc['name'], 'Statusi': status, 'Numri fiskal':doc['fiscalNum'],'Tipi i biznesit':doc['type']['sq'] , 'Numri i pun'u'\xeb''tor'u'\xeb''ve': doc['employeeCount'], 'Kapitali':doc['capital'],'Pronar'u'\xeb''':owners, 'Gjinia e pronarit': ownersGender,'Personat e autorizuar': authorized, 'Data e fillimit': estDate,'Data e aplikimit': doc['applicationDate'].date(), 'Linku n'u'\xeb'' arbk': doc['arbkUrl'], 'Numri i regjistrimit': doc['registrationNum'], 'Komuna':doc['municipality']['municipality']['sq'], 'Aktivitetet':acts, 'Data e marrjes s'u'\xeb'' t'u'\xeb'' dh'u'\xeb''nave': doc['dataRetrieved'].date()}
                    writer.writerow(DictUnicodeProxy(row))
def make_csv_en(download_dir, range_download_year, type_of_date):
    for year in range_download_year:
        print 'creating %s documents english: arbk-%s.csv'%(type_of_date, year)
        if year == 2017:
            if type_of_date == "applicationDate":
                filename_csv = '%s/arbk-%s(applicationDate)(en)(uncomplete).csv'%(download_dir, year)
            else:
                filename_csv = '%s/arbk-%s(establishmentDate)(en)(uncomplete).csv'%(download_dir, year)
        else:
            if type_of_date == "applicationDate":
                filename_csv = '%s/arbk-%s(applicationDate)(en).csv'%(download_dir, year)
            else:
                filename_csv = '%s/arbk-%s(establishmentDate)(en).csv'%(download_dir, year)
        if os.path.isfile(filename_csv):
            print 'csv exitsts: %s' % filename_csv
        else:
            cursor = download_biz_by_year(type_of_date,year)
            with open(filename_csv, 'w') as csvfile:
                fieldnames = ['Name of Business', 'Status', 'Fiscal number', 'Number of employees','Business type','Capital', 'Owners', 'Owners Gender',
                              'Authorized Persons','Date of establishment','Date of application', 'Link of ARBK',
                              'Registration number', 'Municipality', 'Activities', 'Date of data retrievement']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for doc in cursor:
                    acts = ''
                    owners = ''
                    authorized = ''
                    ownersGender = ''
                    status = ""
                    try:
                        status = doc['status']['en']
                    except Exception as e:
                        status = ""
                    for i in doc['activities']:
                        dc = set_name_to_activities(i,'en')
                        if len(doc['activities']) > 1:
                            acts += '%s-%s |\n'%(str(i),dc.encode('utf-8'))
                        else:
                            acts += '%s-%s\n'%(str(i),dc.encode('utf-8'))
                    for owner in doc['owners']:
                        if len(doc['owners']) > 1:
                            owners += '%s,\n'%owner['name'].encode('utf-8')
                            ownersGender += '%s,\n'%owner['gender'].encode('utf-8')
                        else:
                            owners += '%s\n'%owner['name'].encode('utf-8')
                            ownersGender += '%s\n'%owner['gender'].encode('utf-8')
                    for auth in doc['authorized']:
                        if len(doc['owners']) > 1:
                            authorized += '%s,\n'%auth['name'].encode('utf-8')
                        else:
                            authorized += '%s\n'%auth['name'].encode('utf-8')
                    try:
                        estDate = doc['establishmentDate'].date()
                    except Exception as e:
                        estDate = ""
                    row = {'Name of Business': doc['name'], 'Status': status, 'Fiscal number':doc['fiscalNum'],'Business type':doc['type']['en'] , 'Number of employees':doc['employeeCount'], 'Capital':doc['capital'],'Owners':owners, 'Owners Gender':ownersGender,
                           'Authorized Persons': authorized, 'Date of establishment': estDate,'Date of application': doc['applicationDate'].date(), 'Link of ARBK': doc['arbkUrl'], 'Registration number': doc['registrationNum'], 'Municipality':doc['municipality']['municipality']['en'], 'Activities':acts, 'Date of data retrievement': doc['dataRetrieved'].date()}
                    writer.writerow(DictUnicodeProxy(row))

def make_all_data_zip_csv_sq(download_dir):
    filename_csv = '%s/arbk-data(sq).csv'%download_dir
    if os.path.isfile(filename_csv):
        print 'arbk-data(csv).zip exitsts. Skipping'
    else:
        cursor = db.reg_businesses.find(no_cursor_timeout=True)
        print 'creating file albanian: arbk-data(csv)(sq).zip'
        with open(filename_csv, 'w') as csvfile:
            fieldnames = ['Emri i biznesit', 'Statusi', 'Numri fiskal','Tipi i biznesit', 'Numri i pun'u'\xeb''tor'u'\xeb''ve','Kapitali', 'Pronar'u'\xeb''', 'Gjinia e pronarit','Personat e autorizuar','Data e fillimit','Data e aplikimit', 'Linku n'u'\xeb'' arbk', 'Numri i regjistrimit', 'Komuna', 'Aktivitetet', 'Data e marrjes s'u'\xeb'' t'u'\xeb'' dh'u'\xeb''nave']
            csvwriter = csv.DictWriter(csvfile, delimiter=',', fieldnames=fieldnames)
            csvwriter.writeheader()
            try:
                for doc in cursor:
                    acts = ''
                    owners = ''
                    ownersGender = ''
                    authorized = ''
                    status = ""
                    try:
                        status = doc['status']['sq']
                    except Exception as e:
                        status = ""
                    for i in doc['activities']:
                        dc = set_name_to_activities(i,'sq')
                        if len(doc['activities']) > 1:
                            acts += '%s-%s |\n'%(str(i),dc.encode('utf-8'))
                        else:
                            acts += '%s-%s\n'%(str(i),dc.encode('utf-8'))
                    for owner in doc['owners']:
                        if len(doc['owners']) > 1:
                            owners += '%s,\n'%owner['name'].encode('utf-8')
                            ownersGender += '%s,\n'%gender_sq(owner['gender'])
                        else:
                            owners += '%s\n'%owner['name'].encode('utf-8')
                            ownersGender += '%s\n'%gender_sq(owner['gender'])
                    for auth in doc['authorized']:
                        if len(doc['owners']) > 1:
                            authorized += '%s,\n'%auth['name'].encode('utf-8')
                        else:
                            authorized += '%s\n'%auth['name'].encode('utf-8')
                    try:
                        estDate = doc['establishmentDate'].date()
                    except Exception as e:
                        estDate = ""
                    row = {'Emri i biznesit': doc['name'], 'Statusi': status, 'Numri fiskal':doc['fiscalNum'],'Tipi i biznesit':doc['type']['sq'] , 'Numri i pun'u'\xeb''tor'u'\xeb''ve': doc['employeeCount'],'Kapitali':doc['capital'],'Pronar'u'\xeb''':owners, 'Gjinia e pronarit': ownersGender,'Personat e autorizuar': authorized, 'Data e fillimit': estDate,'Data e aplikimit': doc['applicationDate'].date(), 'Linku n'u'\xeb'' arbk': doc['arbkUrl'], 'Numri i regjistrimit': doc['registrationNum'], 'Komuna':doc['municipality']['municipality']['sq'], 'Aktivitetet':acts, 'Data e marrjes s'u'\xeb'' t'u'\xeb'' dh'u'\xeb''nave': doc['dataRetrieved'].date()}
                    csvwriter.writerow(DictUnicodeProxy(row))
            except Exception as e:
                print str(e)
def make_all_data_zip_csv_en(download_dir):
    filename_csv = '%s/arbk-data(en).csv'%download_dir
    if os.path.isfile(filename_csv):
        print 'arbk-data(csv).zip exitsts. Skipping'
    else:
        cursor = db.reg_businesses.find(no_cursor_timeout=True)
        print 'creating file english: arbk-data(csv)(en).zip'
        with open(filename_csv, 'w') as csvfile:
            fieldnames = ['Name of Business', 'Status', 'Fiscal number','Number of employees','Business type','Capital', 'Owners', 'Owners Gender', 'Authorized Persons','Date of establishment','Date of application', 'Link of ARBK', 'Registration number', 'Municipality', 'Activities', 'Date of data retrievement']
            csvwriter = csv.DictWriter(csvfile, delimiter=',', fieldnames=fieldnames)
            csvwriter.writeheader()
            try:
                for doc in cursor:
                    acts = ''
                    owners = ''
                    authorized = ''
                    ownersGender = ''
                    status = ""
                    try:
                        status = doc['status']['en']
                    except Exception as e:
                        status = ""
                    for i in doc['activities']:
                        dc = set_name_to_activities(i,'en')
                        if len(doc['activities']) > 1:
                            acts += '%s-%s |\n'%(str(i),dc.encode('utf-8'))
                        else:
                            acts += '%s-%s\n'%(str(i),dc.encode('utf-8'))
                    for owner in doc['owners']:
                        if len(doc['owners']) > 1:
                            owners += '%s,\n'%owner['name'].encode('utf-8')
                            ownersGender += '%s,\n'%owner['gender'].encode('utf-8')
                        else:
                            owners += '%s\n'%owner['name'].encode('utf-8')
                            ownersGender += '%s\n'%owner['gender'].encode('utf-8')

                    for auth in doc['authorized']:
                        if len(doc['owners']) > 1:
                            authorized += '%s,\n'%auth['name'].encode('utf-8')
                        else:
                            authorized += '%s\n'%auth['name'].encode('utf-8')
                    try:
                        estDate = doc['establishmentDate'].date()
                    except Exception as e:
                        estDate = ""
                    row = {'Name of Business': doc['name'], 'Status': status, 'Fiscal number':doc['fiscalNum'],'Business type':doc['type']['en'] , 'Number of employees':doc['employeeCount'], 'Capital':doc['capital'],'Owners':owners, 'Owners Gender':ownersGender,
                           'Authorized Persons': authorized, 'Date of establishment': estDate,'Date of application': doc['applicationDate'].date(), 'Link of ARBK': doc['arbkUrl'], 'Registration number': doc['registrationNum'], 'Municipality':doc['municipality']['municipality']['en'], 'Activities':acts, 'Date of data retrievement': doc['dataRetrieved'].date()}
                    csvwriter.writerow(DictUnicodeProxy(row))
            except Exception as e:
                print str(e)

class DictUnicodeProxy(object):
    def __init__(self, d):
        self.d = d
    def __iter__(self):
        return self.d.__iter__()
    def get(self, item, default=None):
        i = self.d.get(item, default)
        if isinstance(i, unicode):
            return i.encode('utf-8')
        return i

download_dir = 'app/static/downloads'
range_download_year = range(2000,2018)
make_json_sq(download_dir, range_download_year, "establishmentDate")
make_json_sq(download_dir, range_download_year, "applicationDate")

make_json_en(download_dir, range_download_year, "establishmentDate")
make_json_en(download_dir, range_download_year, "applicationDate")

make_csv_en(download_dir, range_download_year, "establishmentDate")
make_csv_en(download_dir, range_download_year, "applicationDate")

make_csv_sq(download_dir, range_download_year, "applicationDate")
make_csv_sq(download_dir, range_download_year, "establishmentDate")

make_all_data_zip_csv_sq(download_dir)
make_all_data_zip_csv_en(download_dir)
