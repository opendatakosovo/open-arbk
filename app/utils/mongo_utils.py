#coding: utf-8
import datetime
from bson.objectid import ObjectId

class MongoUtils(object):

    def __init__(self, mongo):
        self.mongo = mongo
        self.reg_businesses_collection = 'reg_businesses'
        self.municipalities = 'municipalities'
        self.activities = 'activities'
        self.posts = 'posts'

    def get_all_docs(self):
        result = self.mongo.db[self.reg_businesses_collection].find()
        return result
    def docs_count(self):
        result = self.mongo.db[self.reg_businesses_collection].count()
        return result

    def get_all_activities(self):
        result = self.mongo.db[self.activities].find()
        return result

    def get_employees(self, activity, municipality, current_lang):
        micro_query = []
        mini_query = []
        middle_query = []
        big_query = []
        match_micro_employee = {'$match': {"employeeCount": {"$gte": 1,"$lte": 9}}}
        match_mini_employee = {'$match': {"employeeCount": {"$gte": 10,"$lte": 49}}}
        match_middle_employee = {'$match': {"employeeCount": {"$gte": 50,"$lte": 249}}}
        match_big_employee = {'$match': {"employeeCount": {"$gte": 250}}}
        group_status = {'$group':{"_id":"$status", "count":{'$sum': 1}}}
        act = self.mongo.db[self.activities].find({"activity.%s"%current_lang:activity})
        code = 0
        for doc in act:
            code = doc['code']
        match_activity = {'$match': {"activities":int(code)}}
        match_municipality = {'$match': {"municipality.municipality.%s"%current_lang: municipality}}
        db = self.mongo.db[self.reg_businesses_collection]
        if municipality != "any":
            micro_query.append(match_municipality)
            mini_query.append(match_municipality)
            middle_query.append(match_municipality)
            big_query.append(match_municipality)
        if activity != "any":
            micro_query.append(match_activity)
            mini_query.append(match_activity)
            middle_query.append(match_activity)
            big_query.append(match_activity)
        micro_query.extend((match_micro_employee, group_status))
        mini_query.extend((match_mini_employee, group_status))
        middle_query.extend((match_middle_employee, group_status))
        big_query.extend((match_big_employee, group_status))
        result_micro = db.aggregate(micro_query)
        for res in result_micro['result']:
            if res['_id'] == "":
                result_micro['result'].remove(res)
        result_mini = db.aggregate(mini_query)
        result_middle = db.aggregate(middle_query)
        result_big = db.aggregate(big_query)
        allResults = [result_micro, result_mini, result_middle, result_big]
        total = 0
        for result in allResults:
            if len(result['result']) == 0:
                result['result'].append({'count': 0, '_id': {'sq': 'Shuar', 'en':'Dissolved'}})
                result['result'].append({'count': 0, '_id': {'sq': 'Aktiv', 'en':'Active'}})
            elif len(result['result']) == 1:
                if result['result'][0]['_id']['sq'] == "Aktiv":
                    result['result'].insert(0,{'count': 0, '_id': {'sq': 'Shuar', 'en':'Dissolved'}})
                else:
                    result['result'].insert(0,{'count': 0, '_id': {'sq': 'Aktiv', 'en':'Aktive'}})
            total += result['result'][0]['count']+result['result'][1]['count']        
        return {
            "micro":{
                "total":result_micro['result'][0]['count']+result_micro['result'][1]['count'],
                result_micro['result'][1]['_id'][current_lang]:result_micro['result'][1]['count'],
                result_micro['result'][0]['_id'][current_lang]:result_micro['result'][0]['count']
            },
            "mini":{
                "total":result_mini['result'][0]['count']+result_mini['result'][1]['count'],
                result_mini['result'][1]['_id'][current_lang]:result_mini['result'][1]['count'],
                result_mini['result'][0]['_id'][current_lang]:result_mini['result'][0]['count']
            },
            "middle":{
                "total":result_middle['result'][0]['count']+result_middle['result'][1]['count'],
                result_middle['result'][1]['_id'][current_lang]:result_middle['result'][1]['count'],
                result_middle['result'][0]['_id'][current_lang]:result_middle['result'][0]['count']
            },
            "big":{
                "total":result_big['result'][0]['count']+result_big['result'][1]['count'],
                result_big['result'][1]['_id'][current_lang]:result_big['result'][1]['count'],
                result_big['result'][0]['_id'][current_lang]:result_big['result'][0]['count']
            },
            "total":total}

    # Search engine
    def search_engine(self, page, items_per_page, business, status, person, person_status, municipality, current_lang):
        search = {}
        search_person = {
            '$or':[
                    {"slugifiedOwners": {"$regex": person}},
                    {"slugifiedAuthorized": {"$regex": person}}
                ]
            }
        search_person_status = {
            person_status: {"$regex": person}
            }
        search_bussiness = {
            "slugifiedBusiness": {"$regex": business}
            }
        search_bussiness_status = {
            "status.sq": status
            }
        search_municipality = {
            "slugifiedMunicipality.%s"%current_lang: municipality
            }
        if person != "":
            if person_status != "any":
                search.update(search_person_status)
            else:
                search.update(search_person)
        if business != "":
            search.update(search_bussiness)
        if status != "any":
            search.update(search_bussiness_status)
        if municipality != "any":
            search.update(search_municipality)
        result = self.mongo.db[self.reg_businesses_collection].find(search)
        final_result = result.skip(items_per_page*(page-1)).limit(items_per_page)
        count = result.count()
        return {"result":final_result, "count":count}

    def index_create(self):
        result = self.mongo.db[self.reg_businesses_collection].create_index("formatted.slugifiedOwners", 1)
        return result

    def get_limit_businesses(self, num):
        result = self.mongo.db[self.reg_businesses_collection].find().limit(num)
        return result

    global checkMergeMunicipalityQuery

    # Return queries to merge municipalities that are not in map with those in array
    def checkMergeMunicipalityQuery(given_municipality, current_lang):
        queryMunicipalities = None;
        if given_municipality == "Gjakovë".decode('utf-8') or given_municipality == "Gjakova":
            queryMunicipalities = [{"municipality.municipality.%s"%current_lang: given_municipality}, {"municipality.municipality.sq": "Junik"}]
        elif given_municipality == "Prishtinë".decode('utf-8') or given_municipality == "Pristina":
            queryMunicipalities = [{"municipality.municipality.%s"%current_lang: given_municipality}, {"municipality.municipality.en": "Gracanice"}]
        elif given_municipality == "Ferizaj":
            queryMunicipalities = [{"municipality.municipality.%s"%current_lang: given_municipality}, {"municipality.municipality.en": "Hani i Elezit"}]
        elif given_municipality == "Prizren":
            queryMunicipalities = [{"municipality.municipality.%s"%current_lang: given_municipality}, {"municipality.municipality.en": "Mamush"}]
        elif given_municipality == "Gjilan":
            queryMunicipalities = [{"municipality.municipality.%s"%current_lang: given_municipality}, {"municipality.municipality.en": "Ranilug"}, {"municipality.municipality.en": "Partesh"}, {"municipality.municipality.en": "Klokot"}]
        else:
            queryMunicipalities = [{"municipality.municipality.%s"%current_lang: given_municipality}]
        return queryMunicipalities


    def get_businesses(self, municipality, activity, status, owner_gender, current_lang):
        if activity != '':
            if status != '':
                finalMunicipalityQuery = checkMergeMunicipalityQuery(municipality, current_lang)
                query = {
                "$or": finalMunicipalityQuery,
                "applicationDate": {"$gte": datetime.datetime(2000, 1, 1), "$lt": datetime.datetime(2019, 3, 10)},
                "status.%s"%current_lang: status,
                "activities": {"$in": [activity]}}
                if owner_gender != "any":
                    query['owners.gender'] = owner_gender
                result = self.mongo.db[self.reg_businesses_collection].find(query)
                
            else:
                finalMunicipalityQuery = checkMergeMunicipalityQuery(municipality, current_lang)
                query = {
                "$or": finalMunicipalityQuery,
                "applicationDate": {"$gte": datetime.datetime(2000, 1, 1), "$lt": datetime.datetime(2019, 3, 10)},
                "activities": {"$in": [activity]}
                }
                if owner_gender != "any":
                    query['owners.gender'] = owner_gender
                result = self.mongo.db[self.reg_businesses_collection].find(query)
        else:
            if status != '':
                finalMunicipalityQuery = checkMergeMunicipalityQuery(municipality, current_lang)
                query = {
                "$or": finalMunicipalityQuery,
                "applicationDate": {"$gte": datetime.datetime(2000, 1, 1), "$lt": datetime.datetime(2019, 3, 10)},
                "status.%s"%current_lang: status}
                if owner_gender != "any":
                    query['owners.gender'] = owner_gender
                result = self.mongo.db[self.reg_businesses_collection].find(query)
            else:
                finalMunicipalityQuery = checkMergeMunicipalityQuery(municipality, current_lang)
                query = {
                "$or": finalMunicipalityQuery,
                "applicationDate": {"$gte": datetime.datetime(2000, 1, 1), "$lt": datetime.datetime(2019, 3, 10)}}
                if owner_gender != "any":
                    query['owners.gender'] = owner_gender
                result = self.mongo.db[self.reg_businesses_collection].find(query)

        return result

    def get_municipalities(self):
        result = self.mongo.db[self.municipalities].find().sort("municipality", 1)
        return result
    def get_people(self, people_type, keyword, page, items_per_page):
        result = self.mongo.db[self.reg_businesses_collection].find({people_type: {"$regex": keyword}}).skip(items_per_page*(page-1)).limit(items_per_page)
        count = self.mongo.db[self.reg_businesses_collection].find({people_type: {"$regex": keyword}}).count()
        return {"result":result, "count":count}
    def get_people_by_municipality(self, people_type, keyword, municipality, page, items_per_page):
        result = self.mongo.db[self.reg_businesses_collection].find(
            {people_type: {"$regex": keyword},
             "slugifiedMunicipality": municipality}).skip(items_per_page*(page-1)).limit(items_per_page)
        count = self.mongo.db[self.reg_businesses_collection].find(
            {people_type: {"$regex": keyword},
             "slugifiedMunicipality": municipality}).count()
        return {"result":result, "count":count}

    # Profile queries
    def get_profiles(self, people_type, person, page, items_per_page):
        result = self.mongo.db[self.reg_businesses_collection].find({people_type: {"$in": [person]}})
        final_result = result.skip(items_per_page*(page-1)).limit(items_per_page)
        count = result.count()
        return {"result":final_result, "count":count}

    # Top ten capital businesses
    def get_top_ten_businesses(self, biz_status, municipality, current_lang, owner_gender):
        query = []
        limit = {'$limit': 10}
        capital_sort = {'$sort': {"capital": -1}}
        status = {'$match': {"status.sq": biz_status}}
        muni = {'$match': {"municipality.municipality.%s"%current_lang: municipality}}
        match_gender = {'$match': {"owners.gender":owner_gender}}
        query.append({'$match': {"applicationDate": {"$gte": datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 3, 10)}}})
        if biz_status != "any":
            query.append(status)
        if municipality != "any":
            query.append(muni)
        if owner_gender != "any":
            query.append(match_gender)
        query.append(capital_sort)
        query.append(limit)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result

    # Businesses through years queries
    def businesses_through_years(self, date_type, year, gender, activity, municipality, current_lang):
        act = self.mongo.db[self.activities].find({"activity.%s"%current_lang:activity})
        code = 0
        for doc in act:
            code = doc['code']
        query = []
        group = {'$group': {"_id": "$status", "count": {"$sum": 1}}}
        match_date = {'$match': { date_type: {"$gte": datetime.datetime(year, 1, 1),
                                              "$lte": datetime.datetime(year+1, 1, 1)}}}
        match_activity = {'$match': {"activities":int(code)}}
        match_gender = {'$match': {"owners.gender":gender}}
        match_municipality = {'$match': {"municipality.municipality.%s"%current_lang: municipality}}
        query.append(match_date)
        if activity != "any":
            query.append(match_activity)
        if gender != "any":
            query.append(match_gender)
        if municipality != "any":
            query.append(match_municipality)
        query.append(group)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        for i in result['result']:
            if i['_id'] == "":
                result['result'].remove(i)
        return result

    # Businesses type
    def get_business_types(self, municipality, business_status, gender, current_lang):
        query = []
        sort_biz = {'$sort': {'total': -1}}
        group = {'$group': {"_id": "$type", "total": {"$sum": 1}}}
        match_status = {'$match': {"status.sq":business_status}}
        match_muni = {'$match': {"municipality.municipality.%s"%current_lang:municipality}}
        match_gender = {'$match': {"owners.gender":gender}}        
        query.append({'$match': {"applicationDate": {"$gte":  datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 3, 10)}}})
        if business_status != "any":
            query.append(match_status)
        if municipality != "any":
            query.append(match_muni)
        if gender != "any":
            query.append(match_gender)
        query.append(group)
        query.append(sort_biz)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result
    def get_count_biz_types(self, business_status, municipality, gender, current_lang):
        query = []
        match_status = {'$match': {"status.sq":business_status}}
        match_muni = {'$match': {"municipality.municipality.%s"%current_lang:municipality}}
        match_gender = {'$match': {"owners.gender":gender}}
        count = {'$count':"all"}
        query.append({'$match': {"applicationDate": {"$gte": datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 3, 10)}}})
        if business_status != "any":
            query.append(match_status)
        if municipality != "any":
            query.append(match_muni)
        if gender != "any":
            query.append(match_gender)
        query.append(count)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result

    # MAP Activities
    def mapi(self, activity, owner_gender, current_lang):
        act = self.mongo.db[self.activities].find({"activity.%s"%current_lang:activity})
        munis = self.mongo.db[self.municipalities].find()
        code = 0
        for doc in act:
            code = doc['code']
        muni = []
        for i in munis:
            muni.append(i['municipality'][current_lang])
        result = []
        cities = {}
        total = 0
        for i in muni:
            query = []
            match_date = {'$match': {"applicationDate": {"$gt": datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 3, 10)}}}
            unwind = {'$unwind': "$activities"}
            match_activity_municipality = {'$match': {"activities":int(code), "municipality.municipality.%s"%current_lang: i}}
            match_owner_gender = {'$match': {"owners.gender":owner_gender}}
            group = {'$group':{'_id':'$municipality.municipality.%s'%current_lang,'capital': {'$sum' :'$capital'}, 'all': {'$sum':1}}}
            query.append(match_date)
            query.append(unwind)
            query.append(match_activity_municipality)
            if owner_gender != "any":
                query.append(match_owner_gender)
            query.append(group)
            res = self.mongo.db[self.reg_businesses_collection].aggregate(query)
            try:
                totalBusinesses = 0
                capital = 0
                if res['result']:
                    totalBusinesses = res['result'][0]['all']
                    capital = res['result'][0]['capital']
                cities.update({i:{'total': totalBusinesses, 'capital': capital}})                
                total += totalBusinesses
            except Exception as e:
                cities.update({i: 0})
        result.append(cities)
        result.append({'Total': total})

        return result
        
    def mapi_all(self, owner_gender, current_lang):
        munis = self.mongo.db[self.municipalities].find()
        muni = []
        for i in munis:
            muni.append(i['municipality'][current_lang])
        result = []
        cities = {}
        total = 0
        for i in muni:
            query = []
            match_municipality = {'$match': {"municipality.municipality.%s"%current_lang: i}}
            match_owner_gender = {'$match': {"owners.gender":owner_gender}}
            group = {'$group':{'_id':'$municipality.municipality.%s'%current_lang,'capital': {'$sum' :'$capital'}, 'all': {'$sum':1}}}
            query.append(match_municipality)
            if owner_gender != "any":
                query.append(match_owner_gender)
            query.append(group)
            res = self.mongo.db[self.reg_businesses_collection].aggregate(query)
            try:
                totalBusinesses = 0
                capital = 0
                if res['result']:
                    totalBusinesses = res['result'][0]['all']
                    capital = res['result'][0]['capital']
                cities.update({i:{'total': totalBusinesses, 'capital': capital}})
                total += res['result'][0]['all']
            except Exception as e:
                cities.update({i:{'total': 0, 'capital': 0}})
        result.append(cities)
        result.append({'Total': total})
        return result

    def mapi_all_status(self, status, owner_gender, current_lang):
        munis = self.mongo.db[self.municipalities].find()
        muni = []
        for i in munis:
            muni.append(i['municipality'][current_lang])
        result = []
        cities = {}
        total = 0
        for i in muni:
            query = []
            match_date_municipality_status = {'$match': {"applicationDate": {"$gte": datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 3, 10)},
                            "municipality.municipality.%s"%current_lang: i, "status.sq": status}}
            match_owner_gender = {'$match': {"owners.gender":owner_gender}}
            group = {'$group':{'_id':'$municipality.municipality.%s'%current_lang,'capital': {'$sum' :'$capital'}, 'all': {'$sum':1}}}
            query.append(match_date_municipality_status)
            if owner_gender != "any":
                query.append(match_owner_gender)
            query.append(group)               
            res = self.mongo.db[self.reg_businesses_collection].aggregate(query)
            try:
                totalBusinesses = 0
                capital = 0
                if res['result']:
                    totalBusinesses = res['result'][0]['all']
                    capital = res['result'][0]['capital']
                cities.update({i:{'total': totalBusinesses, 'capital': capital}})
                total += res['result'][0]['all']
            except Exception as e:
                cities.update({i:{'total': 0, 'capital': 0}})
        result.append(cities)
        result.append({'Total': total})
        return result

    def mapi_status(self, activity, status, owner_gender, current_lang):
        act = self.mongo.db[self.activities].find({"activity.%s"%current_lang:activity})
        munis = self.mongo.db[self.municipalities].find()
        code = 0
        for doc in act:
            code = doc['code']
        muni = []
        result = []
        cities = {}
        total = 0
        for i in munis:
            muni.append(i['municipality'][current_lang])
        for i in muni:
            query = []
            match_date = {'$match': {"applicationDate": {"$gt": datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 3, 10)}}}
            unwind = {'$unwind': "$activities"}
            match_activity_municipality_status = {'$match': {"activities":int(code), "municipality.municipality.%s"%current_lang: i, "status.sq":status}}
            match_owner_gender = {'$match': {"owners.gender":owner_gender}}
            group = {'$group':{'_id':'$municipality.municipality.%s'%current_lang,'capital': {'$sum' :'$capital'}, 'all': {'$sum':1}}}
            query.append(match_date)
            query.append(unwind)
            query.append(match_activity_municipality_status)
            if owner_gender != "any":
                query.append(match_owner_gender)
            query.append(group)
            res = self.mongo.db[self.reg_businesses_collection].aggregate(query)
            try:
                totalBusinesses = 0
                capital = 0
                if res['result']:
                    totalBusinesses = res['result'][0]['all']
                    capital = res['result'][0]['capital']
                cities.update({i:{'total': totalBusinesses, 'capital': capital}})
                total += res['result'][0]['all']
            except Exception as e:
                cities.update({i:{'total': 0, 'capital': 0}})
        result.append(cities)
        result.append({'Total': total})
        return result

    # Get activities from db
    def get_activities(self):
        acts = self.mongo.db[self.activities].find()
        activs = []
        for act in acts:
            activs.append({"activity":act['activity'],"code":act['code']})
        return activs

    # top 10 activity divided in genders
    def get_top_ten_activities_by_gender(self, owner_gender):
        result = self.mongo.db[self.reg_businesses_collection].aggregate([
            {'$match': {"applicationDate": {"$gte": datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 3, 10)}}},
            {'$unwind': "$activities"},
            {'$unwind': "$owners"},
            {'$match' : {"owners.gender":owner_gender}},
            {'$group': {"_id": "$activities",'totali': {'$sum': 1}}},
            {'$sort': {"totali": -1}},
            {'$limit' : 10}
        ])
        return result

    # activities queries
    def activity_years(self, year, activity, current_lang, owner_gender):
        act = self.mongo.db[self.activities].find({"activity.%s"%current_lang:activity})
        code = 0
        for doc in act:
            code = doc['code']
        
        query = []
        match_applicationDate = {'$match': {"applicationDate": {"$gte": datetime.datetime(year, 1, 1),
                                              "$lte": datetime.datetime(year+1, 1, 1)}}}
        unwind = {'$unwind': "$activities"}
        match_activities = {'$match': {"activities":int(code)}}
        match_gender = {'$match' : {"owners.gender":owner_gender}}
        group = {'$group': {"_id": "$status", "count": {"$sum": 1}}}
        query.append(match_applicationDate)
        query.append(unwind)
        query.append(match_activities)
        if owner_gender != "any":
            query.append(match_gender)
        query.append(group)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result

    # activities employment line
    def activity_employment_line(self, year, activity, current_lang):
        act = self.mongo.db[self.activities].find({"activity.%s"%current_lang:activity})
        code = 0
        for doc in act:
            code = doc['code']

        
        query = []
        match_establishmentDate = {'$match': {"applicationDate": {"$gte": datetime.datetime(year, 1, 1),
                                              "$lte": datetime.datetime(year+1, 1, 1)}}}
        unwind = {'$unwind': "$activities"}
        match_activities = {'$match': {"activities":int(code)}}
        group = {'$group': {"_id": "null", "numEmployees": {"$sum": "$employeeCount"}}}
        query.append(match_establishmentDate)
        query.append(unwind)
        query.append(match_activities)
        query.append(group)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result

    # activities avg capital
    def activity_avg_capital_years(self, year, activity, current_lang):
        act = self.mongo.db[self.activities].find({"activity.%s"%current_lang:activity})
        code = 0
        for doc in act:
            code = doc['code']
        
        query = []
        match_applicationDate = {'$match': {"applicationDate": {"$gte": datetime.datetime(year, 1, 1),
                                              "$lte": datetime.datetime(year+1, 1, 1)}}}
        unwind = {'$unwind': "$activities"}
        match_activities = {'$match': {"activities":int(code)}}
        group = {'$group': {"_id": "null", "capital": {"$sum": "$capital"}, "all": {"$sum": 1}}}
        query.append(match_applicationDate)
        query.append(unwind)
        query.append(match_activities)
        query.append(group)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result

    # top used activities
    def get_most_used_activities(self, status, municipality, current_lang, owner_gender):
        query = []
        unwind = {'$unwind': "$activities"}
        group = {'$group': {"_id": "$activities", 'totali': {'$sum': 1}}}
        sort_activities = {'$sort': {"totali": -1}}
        match_muni = {'$match': {'municipality.municipality.%s'%current_lang: municipality}}
        match_status = {'$match': {'status.sq': status}}
        match_gender = {'$match' : {"owners.gender":owner_gender}}
        query.append({'$match': {"applicationDate": {"$gte": datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 3, 10)}}})
        if status != "any":
            query.append(match_status)
        if municipality != "any":
            query.append(match_muni)
        if owner_gender != "any":
            query.append(match_gender)
        query.append(unwind)
        query.append(group)
        query.append(sort_activities)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result

    # recent activities
    def get_recent_activities(self, year):
        query = []
        unwind = {'$unwind': "$activities"}
        group = {'$group': {"_id": "$activities", 'totali': {'$sum': 1}}}
        sort_activities = {'$sort': {"totali": -1}}
        query.append({'$match': {"applicationDate": {"$gte": datetime.datetime(2019 - int(year), 3, 10),"$lt": datetime.datetime(2019, 3, 10)}}})
        query.append(unwind)
        query.append(group)
        query.append(sort_activities)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result

    # activity employment
    def activity_employment(self, activity, current_lang):
        act = self.mongo.db[self.activities].find({"activity.%s"%current_lang:activity})
        code = 0
        for doc in act:
            code = doc['code']
        
        query_last_3 = []
        query_last_5 = []
        match_establishmentDate_last_3 = {'$match': {"establishmentDate": {"$gte": datetime.datetime(2015, 1, 1),
                                              "$lte": datetime.datetime(2019, 3, 10)}}}
        match_establishmentDate_last_5 = {'$match': {"establishmentDate": {"$gte": datetime.datetime(2012, 1, 1),
                                              "$lte": datetime.datetime(2019, 3, 10)}}}
        unwind = {'$unwind': "$activities"}
        match_activities = {'$match': {"activities":int(code)}}
        group = {'$group': {"_id": "null", "numEmployees": {"$sum": "$employeeCount"}}}
        query_last_3.extend((match_establishmentDate_last_3, unwind, match_activities, group))
        query_last_5.extend((match_establishmentDate_last_5, unwind, match_activities, group))
        result_last_3 = self.mongo.db[self.reg_businesses_collection].aggregate(query_last_3)
        result_last_5 = self.mongo.db[self.reg_businesses_collection].aggregate(query_last_5)
        return [result_last_3['result'][0]['numEmployees'], result_last_5['result'][0]['numEmployees']]

    # Get total businesses by status
    def get_total_by_status(self):
        result = self.mongo.db[self.reg_businesses_collection].aggregate([
            {'$match': { "status":{'$exists' : True,'$ne' : ""}}},
            {'$group': {"_id": "$status", "total": {"$sum": 1}}},
            {'$sort':  {'total': -1}}])
        return result
    def get_stats_by_status(self):
        result = self.mongo.db[self.reg_businesses_collection].aggregate([
            {'$group': {"_id": "$status", "total": {"$sum": 1}}},
            {'$sort':  {'total': -1}}])
        return result
    #Get owners count by gender
    def get_gender_owners_data(self, status, city, current_lang):
        query = []
        unwind = {'$unwind': "$owners"}
        sort_owners = {'$sort': {"all":-1}}
        group = {'$group': {"_id":"$owners.gender", "all":{"$sum":1}}}
        match_status = {'$match': {"status.sq":status}}
        match_muni = {'$match': {"municipality.municipality.%s"%current_lang:city}}
        query.append({'$match': {"applicationDate": {"$gte": datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 3, 10)}}})
        if status != "any":
            query.append(match_status)
        if city != "any":
            query.append(match_muni)
        query.append(unwind)
        query.append(group)
        query.append(sort_owners)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result
    def get_gender_owners_data_count(self, status, city, current_lang):
        query = []
        unwind = {'$unwind': "$owners"}
        sort_owners = {'$sort': {"all":-1}}
        group = {'$group': {"_id":"$owners.gender", "all":{"$sum":1}}}
        match_status = {'$match': {"status.sq":status}}
        match_muni = {'$match': {"municipality.municipality.%s"%current_lang:city}}
        count = {'$count':"all"}
        query.append({'$match': {"applicationDate": {"$gte": datetime.datetime(2000, 1, 1),"$lt": datetime.datetime(2019, 6, 1)}}})
        if status != "any":
            query.append(match_status)
        if city != "any":
            query.append(match_muni)
        query.append(unwind)
        query.append(group)
        query.append(sort_owners)
        query.append(count)
        result = self.mongo.db[self.reg_businesses_collection].aggregate(query)
        return result

    def published_posts(self):

        posts = self.mongo.db[self.posts].find({'status': 1}).sort([('updated_date', -1)])
        return posts

    def find_post_by_id(self, post_id):
        post = self.mongo.db[self.posts].find_one({'_id': ObjectId(post_id)})
        return post
