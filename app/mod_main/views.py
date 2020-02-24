#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Blueprint, g, render_template, Response, request, send_file, send_from_directory, redirect, url_for
from app import mongo_utils, download_folder, cache, babel
from bson import json_util
from slugify import slugify
import re, unidecode, urllib
import sys, csv, json, math
from bs4 import BeautifulSoup

reload(sys)

mod_main = Blueprint('main', __name__)

@mod_main.route('/', methods=['GET'])
def main():
   return redirect("/sq", code=302)

@mod_main.route('/<lang_code>', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        # Get the search values from url
        items_per_page = 10
        search_keyword = request.args.get('person', default="", type=str)
        business_keyword = request.args.get('business', default="", type=str)
        status = request.args.get('person-status', default="any", type=str)
        city = request.args.get('municipality', default="any", type=str)
        biz_status = request.args.get('biz-status', default="any", type=str)
        page = request.args.get('page', default=1, type=int)
        business = slugify(business_keyword.lower())
        person = slugify(search_keyword.lower())
        municipality = slugify(city.lower())
        person_status = ""
        if status == "auth":
            person_status = "slugifiedAuthorized"
        elif status == "owner":
            person_status = "slugifiedOwners"
        else:
            person_status = "any"
        municipalities = mongo_utils.get_municipalities()
        # Call the search_engine function from mongo_utils
        result = mongo_utils.search_engine(page, items_per_page, business, biz_status, person, person_status, municipality, g.current_lang)
        # docs_count is the number of the documents that are found without limits, for pagination.
        docs_count = result['count']
        return render_template('index.html',search_result=result['result'], count=docs_count, items_per_page=items_per_page, municipalities = municipalities)

@mod_main.route('/<lang_code>/kerko/<string:status>/<string:person>', methods=['GET', 'POST'])
@cache.memoize()
def profile(status, person):
    items_per_page = 10
    page = request.args.get('page', default=1, type=int)
    person_to_lower = slugify(person.lower())
    municipalities = mongo_utils.get_municipalities()
    if status == 'owner':
        person_data = mongo_utils.get_profiles("slugifiedOwners", person_to_lower, page, items_per_page)
    else:
        person_data = mongo_utils.get_profiles("slugifiedAuthorized", person_to_lower, page, items_per_page)
    return render_template('profile.html', profile_data=person_data['result'], count=person_data['count'],
                           municipalities=municipalities, status=status, person=person, items_per_page=items_per_page)

@mod_main.route('/<lang_code>/rekomandimet', methods=['GET'])
def recommendation():
   if request.method == 'GET':
       return render_template('recommendationPage.html')

@mod_main.route('/<lang_code>/vizualizimet', methods=['GET', 'POST'])
def visualization():
    if request.method == 'GET':
        activities = mongo_utils.get_activities()
        top =top_ten("any","any","any")
        komunat = mongo_utils.get_municipalities()
        return render_template('visualizations.html', top=top, komunat=komunat, activities=activities)
    if request.method == 'POST':
        city = request.form['city_id']
        status = request.form['status']
        owner_gender = request.form['owner_gender']
        top = top_ten(status, city, owner_gender)
        return Response(response=json_util.dumps(top), status=200, mimetype='application/json')
@cache.memoize()
def top_ten(status, city, owner_gender):
    top_result = mongo_utils.get_top_ten_businesses(status, city, g.current_lang, owner_gender)
    return top_result

@mod_main.route('/<lang_code>/through-years', methods=['POST'])
def start_date():
    date_type = request.form['date_type']
    owner_gender = request.form['owner_gender']
    activity = request.form['activity']
    city = request.form['city_id']
    api = through_years(date_type, g.current_lang, owner_gender, activity, city)
    return Response(response=json_util.dumps(api), status=200, mimetype='application/json')
@cache.memoize()
def through_years(date_type, current_lang, gender, activity, municipality):
    api = {}
    y = 0
    for i in range(2000, 2020):
        year = "d" + str(y)
        y += 1
        data = mongo_utils.businesses_through_years(date_type, i, gender, activity, municipality, current_lang)
        if len(data['result']) == 1:
            if data['result'][0]['_id'][current_lang] == "Aktiv" or data['result'][0]['_id'][current_lang] == "Active":
                data['result'].append({"_id": {"sq":"Shuar","en":"Dissolved"}, "count": 0})
            else:
                data['result'].append({"_id": {"en":"Active", "sq":"Aktiv"}, "count": 0})
        elif len(data['result']) == 0:
            data['result'] = ([{"_id": {"sq":"Shuar","en":"Dissolved"}, "count": 0},{"_id": {"en":"Active", "sq":"Aktiv"}, "count": 0}])
        res = {data['result'][0]['_id'][current_lang]: data['result'][0]['count'],data['result'][1]['_id'][current_lang]: data['result'][1]['count']}
        api.update({year: res})
    return api

@mod_main.route('/<lang_code>/activities-years', methods=['GET', 'POST'])
def activity_years():
    if request.method == 'POST':
        activity = request.form['activity']
        owner_gender = request.form['owner_gender']
        api = activity_years_func(activity, owner_gender)
        return Response(response=json_util.dumps(api), status=200, mimetype='application/json')
@cache.memoize()
def activity_years_func(activity, owner_gender):
    api = {}
    y = 0
    for i in range(2000, 2020):
        year = "d" + str(y)
        y += 1
        data = mongo_utils.activity_years(i, activity, g.current_lang, owner_gender)
        if len(data['result']) == 0:
            data['result'].append({"_id": {"sq":"Shuar","en":"Dissolved"}, "count": 0})
            data['result'].append({"_id": {"en":"Active", "sq":"Aktiv"}, "count": 0})
        elif len(data['result']) == 1:
            if data['result'][0]['_id'][g.current_lang] == "Aktiv" or data['result'][0]['_id'][g.current_lang] == "Active":
                data['result'].append({"_id": {"sq":"Shuar","en":"Dissolved"}, "count": 0})
            else:
                data['result'].append({"_id": {"en":"Active", "sq":"Aktiv"}, "count": 0})
        res = {data['result'][0]['_id'][g.current_lang]: data['result'][0]['count'],data['result'][1]['_id'][g.current_lang]: data['result'][1]['count']}
        api.update({year: res})
    return api

@mod_main.route('/<lang_code>/activities-employment-line', methods=['GET', 'POST'])
def activity_employment_line():
    if request.method == 'POST':
        activity = request.form['activity']
        api = activity_employment_line_func(activity)
        return Response(response=json_util.dumps(api), status=200, mimetype='application/json')
@cache.memoize()
def activity_employment_line_func(activity):
    api = {}
    y = 0
    for i in range(2000, 2020):
        year = "d" + str(y)
        y += 1
        data = mongo_utils.activity_employment_line(i, activity, g.current_lang)
        if len(data['result']) > 0:
            num = data['result'][0]['numEmployees']
        else:
            num = 0
        api.update({year: num})
    return api

@mod_main.route('/<lang_code>/activities-employment', methods=['GET', 'POST'])
def activity_employment():
    if request.method == 'POST':
        activity = request.form['activity']
        api = activity_employment_func(activity)
        return Response(response=json_util.dumps(api), status=200, mimetype='application/json')
@cache.memoize()
def activity_employment_func(activity):
    data = mongo_utils.activity_employment(activity, g.current_lang)
    return data

@mod_main.route('/<lang_code>/activities-avg-capital-years', methods=['GET', 'POST'])
def activity_avg_capital_years():
    if request.method == 'POST':
        activity = request.form['activity']
        api = activity_avg_capital_years_func(activity)
        return Response(response=json_util.dumps(api), status=200, mimetype='application/json')

@cache.memoize()
def activity_avg_capital_years_func(activity):
    api = {}
    y = 0
    for i in range(2000, 2020):
        year = "y" + str(y)
        y += 1
        data = mongo_utils.activity_avg_capital_years(i, activity, g.current_lang)
        if data['result']:
            if data['result'][0]['all'] == 0:
                avg_capital = 0
            else:
                avg_capital = data['result'][0]['capital'] / float(data['result'][0]['all'])
            res = {"AvgCapital": round(avg_capital,2)}
        else:
            res = {"AvgCapital": 0}
        api.update({year: res})
    return api

@mod_main.route('/<lang_code>/businesses-type', methods=['GET', 'POST'])
def businesses_type():
    if request.method == 'GET':
        doc = businesses_type_func("any","any","any")
        docs_count = mongo_utils.docs_count()
        api = {'total': docs_count, 'doc': doc}
        return Response(response=json_util.dumps(api), status=200, mimetype='application/json')
    if request.method == 'POST':
        city = request.form['biz_city_id']
        status = request.form['biz_status']
        gender = request.form['biz_gender']
        docs_count = mongo_utils.get_count_biz_types(status, city, gender, g.current_lang)
        doc = businesses_type_func(status, city, gender)
        api = {'total': docs_count['result'][0]['all'], 'doc': doc}
        return Response(response=json_util.dumps(api), status=200, mimetype='application/json')
    return 'error'
@cache.memoize()
def businesses_type_func(status, city, gender):
    result = mongo_utils.get_business_types(city, status, gender, g.current_lang)
    return result

@cache.memoize()
def set_name_to_activities(given_code):
    activities_collection = mongo_utils.get_all_activities()
    docs = {}
    for activity in activities_collection:
        if str(given_code) == activity['code']:
            docs = {
                "code": given_code,
                "activity": activity['activity']
            }
        else:
            continue
    return docs

@cache.memoize()
def prepare_activity_api(activities_collection):
    activity_items = []
    for activity in activities_collection['result']:
        activity_set = set_name_to_activities(activity['_id'])
        if len(activity_set) != 0:
            activity_items.append({
                "total_businesses": activity['totali'],
                "details": activity_set
            })
    activities_api = {'activities': activity_items}
    return activities_api

@mod_main.route('/<lang_code>/top-activities', methods=['GET', 'POST'])
def activities():
    if request.method == 'GET':
        all_businesses_activities = activities_func("any","any","any")
        result = prepare_activity_api(all_businesses_activities)
        return Response(response=json_util.dumps(result), status=200, mimetype='application/json')
    elif request.method == 'POST':
        city = request.form['city']
        status = request.form['status']
        owner_gender = request.form['owner_gender']
        business_activities = activities_func(status, city, owner_gender)
        result = prepare_activity_api(business_activities)
        return Response(response=json_util.dumps(result), status=200, mimetype='application/json')
    return "Error"

@mod_main.route('/<lang_code>/top-recent-activities', methods=['GET', 'POST'])
def recent_activities():
    if request.method == 'POST':
        year = request.form['year']
        all_businesses_activities = recent_activities_func(year)
        result = prepare_activity_api(all_businesses_activities)
        return Response(response=json_util.dumps(result), status=200, mimetype='application/json')
    return "Error"

@cache.memoize()
def activities_func(status, city, owner_gender):
    result = mongo_utils.get_most_used_activities(status, city, g.current_lang, owner_gender)
    return result

@cache.memoize()
def recent_activities_func(year):
    result = mongo_utils.get_recent_activities(year)
    return result

@mod_main.route('/<lang_code>/active-inactive', methods=['GET', 'POST'])
@cache.memoize()
def active_inactive():
    docs = mongo_utils.get_total_by_status()
    api = {
            'total': docs['result'][0]['total']+docs['result'][1]['total'],
            'docs': docs
    }
    return Response(response=json_util.dumps(api), status=200, mimetype='application/json')

@mod_main.route('/<lang_code>/page-stats', methods=['GET', 'POST'])
@cache.memoize()
def page_stats():
    docs = mongo_utils.get_stats_by_status()
    api = {
            'total': mongo_utils.docs_count(),
            'docs': docs
    }
    return Response(response=json_util.dumps(api), status=200, mimetype='application/json')
@mod_main.route('/<lang_code>/harta', methods=['GET', 'POST'])
def activity_map():
    activities = mongo_utils.get_activities()
    return render_template('activity-map.html', activities=activities)

@mod_main.route('/<lang_code>/mapi', methods=['GET', 'POST'])
def mapi():
    if request.method == 'GET':
        agg = mapi_all("any",g.current_lang)
        return Response(response=json_util.dumps(agg), status=200, mimetype='application/json')
    if request.method == 'POST':
        activity = request.form['activity_name']
        status = request.form['status']
        owner_gender = request.form['gender']
        if activity != "all":
            if status == "Aktiv" or status == "Shuar":
                agg = mapi_status(activity, status, owner_gender, g.current_lang)
            else:
                agg = mapi_activity(activity, owner_gender, g.current_lang)
        else:
            if status == "Aktiv" or status == "Shuar":
                agg = mapi_all_status(status, owner_gender, g.current_lang)
            else:
                agg = mapi_all(owner_gender, g.current_lang)
        return Response(response=json_util.dumps(agg), status=200, mimetype='application/json')
    return Response(response='Error', status=404, mimetype='application/json')
@cache.memoize()
def mapi_all_status(status, owner_gender, current_lang):
    result = mongo_utils.mapi_all_status(status, owner_gender, current_lang)
    return result
@cache.memoize()
def mapi_status(activity, status, owner_gender, current_lang):
    result = mongo_utils.mapi_status(activity, status, owner_gender, current_lang)
    return result
@cache.memoize()
def mapi_activity(activity, owner_gender, current_lang):
    result = mongo_utils.mapi(activity, owner_gender, current_lang)
    return result
@cache.memoize()
def mapi_all(owner_gender, current_lang):
    result = mongo_utils.mapi_all(owner_gender, current_lang)
    return result

@mod_main.route('/<lang_code>/gender-owners', methods=['GET', 'POST'])
def gender_owners():
    if request.method == 'GET':
        docs = gender_owners_func("any","any")
        total = get_gender_owners_data_count("any","any", g.current_lang)
        api = {
            'total': total['result'][0]['all'],
            'doc': docs
        }
        return Response(response=json_util.dumps(api), status=200, mimetype='application/json')
    if request.method == 'POST':
        city = request.form['biz_city_id']
        status = request.form['biz_status']
        docs_count = get_gender_owners_data_count(status, city, g.current_lang)
        doc = gender_owners_func(status, city)
        api = {
            'total': docs_count['result'][0]['all'],
            'doc': doc
        }
        return Response(response=json_util.dumps(api), status=200, mimetype='application/json')
    return 'error'
@cache.memoize()
def get_gender_owners_data_count(status, city, lang_code):
    result = mongo_utils.get_gender_owners_data_count(status, city, lang_code)
    return result
@cache.memoize()
def gender_owners_func(status, city):
    result = mongo_utils.get_gender_owners_data(status, city, g.current_lang)
    return result

@mod_main.route('/<lang_code>/top-10-gender-activities', methods=['GET', 'POST'])
@cache.memoize()
def top_gender_acts():
    if request.method == 'GET':
        docs_females = mongo_utils.get_top_ten_activities_by_gender("female")
        docs_males = mongo_utils.get_top_ten_activities_by_gender("male")
        result_females = prepare_activity_api(docs_females)
        result_males = prepare_activity_api(docs_males)
        result = {"females":result_females, "males":result_males}
        return Response(response=json_util.dumps(result), status=200, mimetype='application/json')
    return 'error'

@mod_main.route('/<lang_code>/employees', methods=['GET', 'POST'])
@cache.memoize()
def employee():
    activity = request.form['activity']
    municipality = request.form['municipality']
    result = mongo_utils.get_employees(activity, municipality, g.current_lang)
    return Response(response=json_util.dumps(result), status=200, mimetype='application/json')

@mod_main.route('/<lang_code>/shkarko', methods=['GET', 'POST'])
def download_page():
    return render_template('downloads.html')

@mod_main.route('/<lang_code>/shkarko/<string:doc_type>/<string:doc_date_type>/<string:year>', methods=['GET'])
def download_doc_year(doc_type, doc_date_type, year):
    if year == "2019":
        if g.current_lang == "en":
            doc_date_type = "registrationDate"
        if g.current_lang == "sq":
            return send_from_directory(download_folder, "arbk-%s(%s)(sq)(pakompletuar).%s"%(year,doc_date_type, doc_type), as_attachment=True)
        else:
            return send_from_directory(download_folder, "arbk-%s(%s)(en)(uncompleted).%s"%(year,doc_date_type, doc_type), as_attachment=True)
    if g.current_lang == "en":
            doc_date_type = "registrationDate"
    return send_from_directory(download_folder, "arbk-%s(%s)(%s).%s"%(year,doc_date_type, g.current_lang, doc_type), as_attachment=True)

@mod_main.route('/<lang_code>/shkarko/<string:doc_type>/all-zip', methods=['GET'])
def download_doc_all(doc_type):
    return send_from_directory(download_folder, "arbk-data-%s(%s).zip"%(doc_type, g.current_lang), as_attachment=True)

def prepare_api_to_show_businesses(json_docs, searchedMunicipality):
    final_json = {'code': 200, 'status': 'OK', 'municipality': searchedMunicipality, 'data': []}
    for json_doc in json_docs:
        final_json['data'].append({
            'info': {
                'name': json_doc['name'],
                'link': json_doc['arbkUrl']
            },
            'municipality': json_doc['municipality'],
            'status': json_doc['status'],
            'activities': json_doc['activities'],
            'owners': json_doc['owners'],
            'authorized': json_doc['authorized'],
        })
    if final_json['data'] == []:
        final_json = {'code': 404, 'status': 'Not Found', 'data': []}
    return final_json

# Endpoint for showing businesses based on municipality, status, owner gender and activities
@mod_main.route('/<lang_code>/show-businesses', methods=['GET'])
def show_businesses():
    municipality = request.args.get('municipality')
    status = request.args.get('status')
    owner_gender = request.args.get('gender')

    if request.args.get('activity'):
        activity = int(request.args.get('activity'))
        if status:
            # Get businesses by activity and status
            json_docs = mongo_utils.get_businesses(municipality, activity, status, owner_gender, g.current_lang)
            final_json = prepare_api_to_show_businesses(json_docs, municipality)
        else:
            # Get busineses only by activity
            json_docs = mongo_utils.get_businesses(municipality, activity, '', owner_gender, g.current_lang)
            final_json = prepare_api_to_show_businesses(json_docs, municipality)
    else:
        activity = ''
        if status:
            # Get only businesses only by status
            json_docs = mongo_utils.get_businesses(municipality, '', status, owner_gender, g.current_lang)
            final_json = prepare_api_to_show_businesses(json_docs, municipality)
        else:
            json_docs = mongo_utils.get_businesses(municipality, '', '', owner_gender, g.current_lang)
            final_json = prepare_api_to_show_businesses(json_docs, municipality)

    return Response(response=json_util.dumps(final_json), status=200, mimetype='application/json')



@mod_main.route('/blog', methods=['GET'])
def blog_main():
   return redirect(url_for('main.blog_page', lang_code='sq' ))

@mod_main.route('/blog/<lang_code>', methods=['GET', 'POST'])
def blog_page():

    published_posts = mongo_utils.published_posts()
    posts = []
    for post in published_posts:
        if g.current_lang == 'sq':
            soup = BeautifulSoup(post['content_al'], features="html.parser")
            for img in soup('img'):
                img.decompose()
            post['post_preview_al'] = soup.get_text()[0:250]
        else:
            soup = BeautifulSoup(post['content_en'], features="html.parser")
            for img in soup('img'):
                img.decompose()
            post['post_preview_en'] = soup.get_text()[0:250]
        
        posts.append(post)


    return render_template('blog.html', posts = posts, totalPosts = len(posts))

@mod_main.route('/post/<post_id>/<lang_code>', methods=['GET', 'POST'])
def single_post(post_id):
    post = mongo_utils.find_post_by_id(post_id)
    post['meta_desc_al'] = BeautifulSoup(post['content_al'], features="html.parser").get_text()
    post['meta_desc_en'] = BeautifulSoup(post['content_en'], features="html.parser").get_text()
    return render_template('single-post.html', post = post)

