import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

# Connect to default host and port
client = MongoClient()

# Access arbk database
db = client.arbk

# Authors collection
authors = db.authors

# Find the super admin
super_admin = authors.find_one({'role': 'super'})

# Check if exists
if super_admin is None:
    new_super_admin = {
        'first_name': 'Open Data',
        'last_name': 'Kosovo',
        'email': 'YOUR EMAIL',
        'password': generate_password_hash('YOURPASSWORD'),
        'role': 'super'
    }
    author_id = authors.insert_one(new_super_admin).inserted_id
    if author_id is None:
        print('\nFailed. Try again!\n')
    else:
        print('\nThe super admin was created successfully\n')
else:
    print('\nSuper admin already exists.')
    answer = input("\nDo you want to reset the password? Type Y or N: ")
    if answer == 'Y':
        print('\nSuper admin details: ')
        print('Full name: ' + super_admin['first_name'] + ' ' + super_admin['last_name'])
        print('Email: ' + super_admin['email'] + '\n')

        new_password = input('\nEnter the new password: ')
        if len(new_password.replace(" ", "")) < 6:
            print('\nMinimum length of password is 6. Try again!')
            quit()
        res = authors.update_one({
        '_id': ObjectId(super_admin['_id'])
    }, {
        '$set': {
            'first_name': super_admin['first_name'],
            'last_name': super_admin['last_name'],
            'email': super_admin['email'],
            'password': generate_password_hash(new_password),
            'role': super_admin['role']
        }
    }, upsert=False)

        if res.modified_count > 0:
            print('\nThe password was updated successfully')
            print('\nBye!')
        else:
            print('\nFailed. Try again!\n')
        quit()
    else:
        print('\nOkay, bye!')
        quit()
    