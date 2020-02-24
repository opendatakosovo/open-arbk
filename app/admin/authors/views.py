from flask import Blueprint, render_template, request, flash, redirect, url_for, g
from flask_babel import gettext
from app.admin.authors.forms import AddAuthorForm, EditAuthorForm
from app.admin import db_helper as db
from app.admin.models import Author
from werkzeug.security import generate_password_hash, check_password_hash
from app.admin.utils import flash_errors
from functools import wraps
from flask_login import current_user, login_required
from app import app

authors = Blueprint('authors', __name__, template_folder="templates/authors")

# admin decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if hasattr(current_user, 'role') == False:
            return redirect(url_for('admin.index', lang_code=g.current_lang))
        if current_user.role == 'author':
            return redirect(url_for('admin.index', lang_code=g.current_lang))
        return f(*args, **kwargs)
    return decorated_function


@authors.route('/<lang_code>', methods=['GET', 'POST'])
@login_required
@admin_required
def index():
    all_authors = db.get_all_authors()
    return render_template('authors_list.html', all_authors = all_authors)

@authors.route('/add/<lang_code>', methods=['GET', 'POST'])
@login_required
@admin_required
def add():
    form = AddAuthorForm()

    if request.method == 'POST':
        if form.validate_on_submit():
            first_name = form.first_name.data
            last_name = form.last_name.data
            email = form.email.data
            password = generate_password_hash(form.password.data)
            role = "admin" if form.is_admin.data is True else "author"
            author = Author(first_name, last_name, email, password, role)

            if db.author_exists(email) is False:
                author_response = db.add_author(author)
                if author_response is True:
                    flash(gettext('Autori u shtua me sukses'), 'success')
                return redirect(url_for('authors.add', lang_code=g.current_lang))
            else:
                flash(gettext('Email adresa ekziston!'), 'error')
                return redirect(url_for('authors.add', lang_code=g.current_lang))
        else:
            flash_errors(form)
    return render_template('add_author.html', form = form)

@authors.route('/edit/<author_id>/<lang_code>', methods=['GET', 'POST'])
@login_required
@admin_required
def edit(author_id):

    form = EditAuthorForm()
    if request.method == 'GET':
        the_author = db.find_author_by_id(author_id)
        if the_author is None:
            flash(gettext('Autori nuk ekziston!'), 'error')
            return redirect(url_for('authors.index', lang_code=g.current_lang))
        elif the_author['role'] == 'super':
            print(current_user.role != 'super')
            # enable edit route if author is not super admin
            return redirect(url_for('authors.index', lang_code=g.current_lang))
        form.first_name.data = the_author['first_name']
        form.last_name.data = the_author['last_name']
        form.email.data = the_author['email']
        form.is_admin.data = False if the_author['role'] == 'author' else True

    if request.method == 'POST':
        the_author = db.find_author_by_id(author_id)
        if the_author is None:
            flash(gettext('Autori nuk ekziston!'), 'error')
            return redirect(url_for('authors.index', lang_code=g.current_lang))
        if form.validate_on_submit():
            first_name = form.first_name.data
            last_name = form.last_name.data
            email = form.email.data
            password = the_author['password']
            role = "admin" if form.is_admin.data is True else "author"

            author = Author(first_name, last_name, email, password, role)

            # if the email is the same do not check if the email exists
            if email == the_author['email'] or db.author_exists(email) is False:
                author_response = db.update_author(author_id, author)
                if author_response == 1:
                    flash(gettext('Autori u ndryshua me sukses'), 'success')
                return redirect(url_for('authors.edit', lang_code=g.current_lang, author_id=author_id))
            else:
                flash(gettext('Email adresa ekziston!'), 'error')
                return redirect(url_for('authors.edit', lang_code=g.current_lang, author_id=author_id))
        else:
            flash_errors(form)
    return render_template('edit_author.html', form = form)


@authors.route('/delete/<author_id>/<lang_code>', methods=['GET', 'POST'])
@login_required
@admin_required
def delete(author_id):
    author = db.find_author_by_id(author_id)
    if author is None:
        flash(gettext('Autori nuk ekziston'), 'error')
        return redirect(url_for('authors.index', lang_code = g.current_lang))
    if request.method == 'POST':
        res = db.delete_author(author_id)
        if res == 0:
            flash(gettext('Autori nuk u fshi'), 'error')
            return redirect(url_for('authors.index', lang_code = g.current_lang))
        elif res == 1:
            flash(gettext('Autori u fshi me sukses'), 'success')
            return redirect(url_for('authors.index', lang_code = g.current_lang))
    return render_template('delete_author.html', author = author)
