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
db.activities.drop()
activities_en_file = open("data-importer/activities_en.json")
activities_en = json.load(activities_en_file)
# create new collection with activity names and codes
with open("data-importer/activities.json","r") as data:
    activities = json.load(data)
    for activity in activities['activities']:
        print activity
        db.activities.insert({"code":activity['code'], "activity":{"en":activities_en[activity['code']], "sq":activity['activity']}})
activities_en_file.close()
