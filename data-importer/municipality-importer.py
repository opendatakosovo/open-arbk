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
db.municipalities.drop()
municipality_types_en_file = open("data-importer/komunat_en.json")
municipality_types_en = json.load(municipality_types_en_file)
# crete new collection with municipalities and their villages
with open("data-importer/komunat.json","r") as data:
    municipalities = json.load(data)
    for municipality in municipalities:
        place = []
        for muni_place in municipalities[municipality]:
            place.append(muni_place)
        db.municipalities.insert({"municipality":{"en":municipality_types_en[municipality], "sq":municipality}, "districts":place, 'slug':{"en":slugify(municipality_types_en[municipality].lower()),"sq":slugify(municipality.lower())} })
municipality_types_en_file.close()
