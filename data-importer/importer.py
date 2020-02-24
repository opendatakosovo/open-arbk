#!/usr/bin/env python
# -*- coding: utf-8 -*-
from pymongo import MongoClient
import re, json, unidecode
from slugify import slugify
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

client = MongoClient("mongodb://localhost:27017")
db = client['arbk']
# drop old collection if there is any
db.reg_businesses.drop()
# open json files where is the data for municipalities and activities
municipalities_json_file = open("data-importer/komunat.json")
municipalities_json = json.load(municipalities_json_file)
gender_people_json_file = open("data-importer/gender_people.json")
gender_people_json = json.load(gender_people_json_file)
municipality_types_en_file = open("data-importer/komunat_en.json")
municipality_types_en = json.load(municipality_types_en_file)
business_types_en_file = open("data-importer/business_types_en.json")
business_types_en = json.load(business_types_en_file)
# Slugifying each string and then updating new elements in 'formatted' docs with slugified strings
def slug_data(slug_string):
    slugified_string = slug_string
    slugified_string = re.sub(r'[,|?|$|/|\|"]',r'', slugified_string)
    slugified_string = unidecode.unidecode(slugified_string)
    return slugified_string.lower()

# Set municipality each place corresponds to
def set_muni(given_city_bus):
    municipalities = municipalities_json
    cities = {}
    found = False
    for place in municipalities:
        for city in municipalities[place]:
            if city != '_id':
                for village in municipalities[place]:
                    if village == given_city_bus:
                        found = True
                        cities = {"municipality": {"en":municipality_types_en[place], "sq":place},"place": given_city_bus}
    if found:
        return cities
    else:
        cities = {
            "municipality": {"en":"Unknown", "sq":"I panjohur"},
            "place": given_city_bus
        }
        return cities
# Set gender to persons based on their names, if they match our database with names or not
def gender_person(person):
    names = gender_people_json
    owner = {}
    divide = person.split(" ")
    if divide[0].title() in names['females']:
    	owner = {"name":person, "gender" : "female"}
    elif divide[0].title() in names['males']:
    	owner = {"name":person, "gender" : "male"}
    else:
    	owner = {"name":person, "gender" : "unknown"}
    return owner

def main():
    docs = db.businesses.find()
    i = 0
    # Looping through each doc
    for doc in docs:
        sluged_owners = []
        gender_owners = []
        slug_auth = []
        gen_auth = []
        city = {}
        epl_nr = 0
        capi = 0
        reg_num = ""
        fiscal_num = 0
        buss_type = ""
        epl_nr = ""
        applicationDate = None
        atkStatus = ""
        status = ""
        arbkUrl = ""
        sluged_owners = []
        establishmentDate = None
        slugified_company_string = ""
        slug_company = ""
        slug_city = {}
        # Looping in owner array of 'formatted' JSON in docs
        for owner in doc['formatted']['owners']:
            slugified_owner_string = slugify(owner.lower())
            sluged_owners.append(slugified_owner_string)
            gender_owner = gender_person(owner)
            gender_owners.append(gender_owner)
        slugified_company_string = re.sub(r'[,|?|$|/|\|"]',r'', doc['formatted']['name'])
        for authorized in doc['formatted']['authorized']:
            slugified_authorized_string = slugify(authorized.lower())
            gender_authorized = gender_person(authorized)
            slug_auth.append(slugified_authorized_string)
            gen_auth.append(gender_authorized)
        try:
            city = set_muni(doc['formatted']['municipality'])
        except Exception as e:
            city = None
        try:
            establishmentDate = doc['formatted']['establishmentDate']
        except Exception as e:
            establishmentDate = None
        try:
            reg_num = doc['formatted']['registrationNum']
        except Exception as e:
            continue
        try:
            atkStatus = doc['formatted']['atkStatus']
        except Exception as e:
            atkStatus = ''
        try:
            buss_type = {"en":business_types_en[doc['formatted']['type']], "sq":doc['formatted']['type']}
        except Exception as e:
            buss_type = ''
        try:
            applicationDate = doc['formatted']['applicationDate']
        except Exception as e:
            applicationDate = None
        try:
            arbkUrl = doc['formatted']['arbkUrl']
        except Exception as e:
            arbkUrl = None
        try:
            status = doc['formatted']['status']
            if status == '':
                satus = ""
            elif status.lower() == "aktiv":
                status = {"en":"Active", "sq":"Aktiv"}
            elif status.lower() == "shuar":
                status = {"en":"Dissolved", "sq":"Shuar"}
        except Exception as e:
            pass
        try:
            if doc['formatted']['capital'] is None:
                capi = 0
            else:
                capi = int(doc['formatted']['capital'])
        except Exception as e:
            pass
        try:
            if doc['formatted']['employeeCount'] is None:
                epl_nr = 0
            else:
                epl_nr = doc['formatted']['employeeCount']
        except Exception as e:
            pass
        try:
            fiscal_num = doc['formatted']['fiscalNum']
        except Exception as e:
            fiscal_num = ''
        slug_company = slugify(slugified_company_string.lower())
        try:
            slug_city = {"en":slugify(city['municipality']['en'].lower()), "sq":slugify(city['municipality']['sq'].lower())}
        except Exception as e:
            slug_city = slugify(city['municipality'].lower())

        db.reg_businesses.insert({
            "registrationNum": reg_num,
            'fiscalNum': fiscal_num,
            "type": buss_type,
            "employeeCount": epl_nr,
            "applicationDate": applicationDate,
            "capital": capi,
            "atkStatus": atkStatus,
            "status": status,
            "arbkUrl": arbkUrl,
            "activities": doc['formatted']['activities'],
            "slugifiedOwners": sluged_owners,
            "establishmentDate": establishmentDate,
            "owners": gender_owners,
            "name": slugified_company_string,
            "slugifiedBusiness": slug_company,
            "slugifiedAuthorized": slug_auth,
            "authorized": gen_auth,
            "municipality": city,
            "slugifiedMunicipality":slug_city,
            "dataRetrieved": doc['formatted']['timestamp']
        })
        i += 1
        print 'Generating documents: [%s]'%i

main()
# close json files
municipalities_json_file.close()
gender_people_json_file.close()
municipality_types_en_file.close()
business_types_en_file.close()
