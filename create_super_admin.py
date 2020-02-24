from werkzeug.security import generate_password_hash, check_password_hash
from app.admin.models import Author
from app.admin import db_helper as db

print 'Complete the form '

first_name = raw_input('First Name: ')
last_name = raw_input('Last Name: ')
email = raw_input('Email: ')
password = raw_input('Password: ')
role = 'super'

author = Author(first_name, last_name, email, generate_password_hash(password), role)

if db.author_exists(email) is False:
    author_response = db.add_author(author)
    if author_response is True:
        print 'Super admin added!'
else:
    print '%s email exists! Try another one' % email