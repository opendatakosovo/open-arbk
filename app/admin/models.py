
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
import datetime
import base64
import os
import sys

class Author(UserMixin):
    author_id = 0
    def __init__(self, first_name, last_name, email, password, role):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.role = role

    def toJson(self):
        author_json = {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'password': self.password,
            'role': self.role,
        }
        return author_json
    
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.email

    def set_id(self, author_id):
        self.author_id = author_id

    @staticmethod
    def validate_login(password_hash, password):
        pw_bytes = isinstance(password_hash, (bytes, bytearray))
        if pw_bytes is True:
            password_hash = password_hash.decode('utf-8')
        return check_password_hash(password_hash, password)

    def password(self):
        return self.password

class Post():

    def __init__(self, feature_img, title_al, content_al, title_en, content_en, author_id):
        self.feature_img = feature_img
        self.title_al = title_al
        self.content_al = content_al
        self.title_en = title_en
        self.content_en = content_en
        self.author_id = author_id
        self.status = 0 
        self.updated_date = datetime.datetime.now()
        # 0 - unpublished, 1 - published

    def toJson(self):
        post_json = {
            'feature_img': self.feature_img,
            'title_al': self.title_al,
            'content_al': self.content_al,
            'title_en': self.title_en,
            'content_en': self.content_en,
            'author_id': self.author_id,
            'status': self.status,
            'updated_date': self.updated_date
        }
        return post_json

    def saveImage(self):

        img = base64.b64decode(self.feature_img.split(",")[1] + "==")

        filename = self.updated_date.strftime("%Y%m%d%H%M%S") + '.jpg'
        with open(os.path.dirname(os.path.abspath(__file__))[:-10]+'/app/static/img/blog/'+filename, 'wb') as f:
            f.write(img)
            self.feature_img = os.path.basename(f.name) 