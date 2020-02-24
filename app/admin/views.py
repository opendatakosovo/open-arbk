from flask import Blueprint, render_template, redirect, url_for, session, request, flash, g
from app.admin import db_helper as db
from flask_login import login_user, logout_user, login_required, current_user
from app.admin.forms import LoginForm
from app.admin.models import Author
from app import lm
from flask_babel import gettext
from app.admin.utils import flash_errors
admin = Blueprint('admin', __name__, template_folder="templates/admin")

@admin.route('/', methods=['GET'])
@login_required
def main():
   return redirect(url_for('admin.index', lang_code='sq' ))

@admin.route('/<lang_code>', methods=['GET', 'POST'])
@login_required
def index():
    total_posts = db.total_posts_num()
    total_authors = db.total_authors_num()
    return render_template('admin_dashboard.html', total_posts = total_posts, total_authors = total_authors)

@admin.route('/login', methods=['GET'])
def main_login():
   return redirect(url_for('admin.login', lang_code='sq' ))

@admin.route('/login/<lang_code>', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            email = form.email.data
            password = form.password.data
            authorJson = db.find_author_by_email(email)
            if authorJson and authorJson['password'] is not None and Author.validate_login(authorJson['password'], password):
                author = Author(authorJson.get('first_name'), authorJson.get('last_name'), authorJson.get('email'), authorJson.get('passowrd'), authorJson.get('role'))
                login_user(author)
                return redirect(request.args.get('next') or url_for('admin.index', lang_code=g.current_lang))
            else:
                flash(gettext('Ky perdorues nuk ekziston ose fjalekalimi eshte i gabuar'), 'error')
                return redirect(url_for('admin.login', lang_code=g.current_lang ))
        else:
            flash_errors(form)
            return redirect(url_for('admin.login', lang_code=g.current_lang ))
    return render_template('admin_login.html', form = form)

@admin.route('/profile/<lang_code>', methods=['GET', 'POST'])
@login_required
def profile():
    return render_template('admin_profile.html', user = current_user)


@admin.route('/logout', methods=['GET'])
@login_required
def main_logout():
    return redirect(url_for('admin.logout', lang_code='sq' ))

@admin.route('/logout/<lang_code>', methods=['GET'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('admin.login', lang_code=g.current_lang ))



@lm.user_loader
def load_user(email):
    authorJson = db.find_author_by_email(email)
    if not authorJson:
        return None
    author = Author(authorJson.get('first_name'), authorJson.get('last_name'), authorJson.get('email'), authorJson.get('passowrd'), authorJson.get('role'))
    author.set_id(authorJson['_id'])
    return author






        


