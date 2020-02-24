import pymongo
from pymongo import MongoClient
from flask.ext.pymongo import PyMongo

from app.admin.models import Author
from bson.objectid import ObjectId
import os
import ConfigParser

config = ConfigParser.ConfigParser()
config.readfp(open(os.path.dirname(os.path.abspath(__file__))[:-10]+'/config.cfg'))

# Connect to default host and port
client = MongoClient()


# Access arbk database
dbname = config.get('Mongo', 'DB_NAME')
db = client[dbname]

# Authors collection
authors = db.authors
posts = db.posts



def add_author(author):
    author_id = authors.insert_one(author.toJson()).inserted_id
    return True if author_id is not None else False

def author_exists(authorEmail):
    author = authors.find_one({'email': authorEmail})
    return False if author is None else True

def find_author_by_email(authorEmail):
    author = authors.find_one({'email': authorEmail})
    return author

def get_all_authors():
    all_authors = list(authors.find({}, {'first_name': 1, 'last_name': 1, 'email': 1, 'role': 1}))
    return all_authors

def total_authors_num():
    total = authors.find({}).count()
    return total

def find_author_by_id(author_id):
    author = authors.find_one({'_id': ObjectId(author_id)})
    return author

def update_author(author_id, author):

    res = authors.update_one({
        '_id': ObjectId(author_id)
    }, {
        '$set': {
            'first_name': author.first_name,
            'last_name': author.last_name,
            'email': author.email,
            'password': author.password,
            'role': author.role
        }
    }, upsert=False)

    return res.modified_count

def delete_author(author_id):
    res = authors.delete_one({'_id': ObjectId(author_id)})
    return res.deleted_count


# P O S T S

def add_post(post):
    post_id = posts.insert_one(post.toJson()).inserted_id
    return True if post_id is not None else False

def get_all_posts():
    all_posts = list(posts.find({}).sort('updated_date', -1))
    return all_posts

def total_posts_num():
    total = posts.find({}).count()
    return total

def find_post_by_id(post_id):
    post = posts.find_one({'_id': ObjectId(post_id)})
    return post

def delete_post(post_id):
    res = posts.delete_one({'_id': ObjectId(post_id)})
    return res.deleted_count

def update_post(post_id, post):

    res = posts.update_one({
        '_id': ObjectId(post_id)
    }, {
        '$set': {
            'feature_img': post.feature_img,
            'title_al': post.title_al,
            'content_al': post.content_al,
            'title_en': post.title_en,
            'content_en': post.content_en,
        }
    }, upsert=False)

    return res.modified_count

def update_post_status(post_id, status):
    status = int(status)
    res = posts.update_one({
        '_id': ObjectId(post_id)
    }, {
        '$set': {
            'status': status
        }
    }, upsert=False)

    return res.modified_count

