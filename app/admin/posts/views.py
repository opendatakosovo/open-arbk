from flask import Blueprint, render_template, request, flash, redirect, url_for, g
from flask_babel import gettext
from app.admin.posts.forms import AddPostForm, EditPostForm
from app.admin import db_helper as db
from app.admin.models import Post
from werkzeug.security import generate_password_hash, check_password_hash
from app.admin.utils import flash_errors
from functools import wraps
from flask_login import current_user, login_required
from app import app
from app.admin.authors.views import admin_required
import json

posts = Blueprint('posts', __name__, template_folder="templates/posts")

@posts.route('/<lang_code>', methods=['GET', 'POST'])
@admin_required
def index():
    all_posts = db.get_all_posts()
    return render_template('posts_list.html', all_posts = all_posts)

@posts.route('/add/<lang_code>', methods=['GET', 'POST'])
@admin_required
def add():
    form = AddPostForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            feature_img = form.feature_img.data

            title_al = form.title_al.data
            content_al = form.content_al.data

            title_en = form.title_en.data
            content_en = form.content_en.data
            
            if len(title_al) < 10 or len(title_en) < 10:
                flash(gettext('Titulli duhet te jete se paku 10 karaktere (per te dy gjuhet)'), 'error')
                # return redirect(url_for('posts.add', lang_code=g.current_lang))
                return render_template('add_post.html', form = form)
            elif len(content_al) < 20 or len(content_en) < 20:
                flash(gettext('Permbajtja duhet te jete se paku 20 (per te dy gjuhet)'), 'error')
                return render_template('add_post.html', form = form)
                # return redirect(url_for('posts.add', lang_code=g.current_lang))
            else:
                post = Post(feature_img, title_al, content_al, title_en, content_en, current_user.author_id)
                if feature_img != "":
                     # convert base64 to image file
                    post.saveImage()
                post_response = db.add_post(post)
                if post_response is True:
                    flash(gettext('Postimi u shtua me sukses'), 'success')
                    return redirect(url_for('posts.index', lang_code=g.current_lang))
                else:
                    flash(gettext('Postimi nuk u shtua me sukses'), 'error')
                    return redirect(url_for('posts.add', lang_code=g.current_lang))

        else:
            flash_errors(form)
    return render_template('add_post.html', form = form)

@posts.route('/edit/<post_id>/<lang_code>', methods=['GET', 'POST'])
@admin_required
def edit(post_id):
    form = EditPostForm()
    if request.method == 'GET':
        the_post = db.find_post_by_id(post_id)
        if the_post is None:
            flash(gettext('Postimi nuk ekziston'), 'error')
            return redirect(url_for('posts.index', lang_code = g.current_lang))
        form.feature_img.data = the_post['feature_img']
        form.title_al.data = the_post['title_al']
        form.content_al.data = the_post['content_al']
        form.title_en.data = the_post['title_en']
        form.content_en.data = the_post['content_en']
    if request.method == 'POST':
        the_post = db.find_post_by_id(post_id)
        if the_post is None:
            flash(gettext('Postimi nuk ekziston'), 'error')
            return redirect(url_for('posts.index', lang_code = g.current_lang))
        if form.validate_on_submit():

            feature_img = form.feature_img.data
            title_al = form.title_al.data
            content_al = form.content_al.data

            title_en = form.title_en.data
            content_en = form.content_en.data
            
            if len(title_al) < 10 or len(title_en) < 10:
                flash(gettext('Titulli duhet te jete se paku 10 karaktere (per te dy gjuhet)'), 'error')
                # return redirect(url_for('posts.edit', lang_code=g.current_lang, post_id=post_id))
                return render_template('edit_post.html', form = form)
            elif len(content_al) < 20 or len(content_en) < 20:
                flash(gettext('Permbajtja duhet te jete se paku 20 (per te dy gjuhet)'), 'error')
                # return redirect(url_for('posts.edit', lang_code=g.current_lang, post_id=post_id))
                return render_template('edit_post.html', form = form)
            else:
                post = Post(feature_img, title_al, content_al, title_en, content_en, current_user.author_id)
                if feature_img != "":
                    post.saveImage()

                post_response = db.update_post(post_id, post)
                if post_response == 1:
                    flash(gettext('Postimi u perditesua me sukses'), 'success')
                    return redirect(url_for('posts.view', lang_code=g.current_lang, post_id=post_id))

                else:
                    flash(gettext('Postimi nuk u perditesua me sukses'), 'error')
                return redirect(url_for('posts.edit', lang_code=g.current_lang, post_id=post_id))
    return render_template('edit_post.html', form = form)
    


@posts.route('/view/<post_id>/<lang_code>', methods=['GET', 'POST'])
@admin_required
def view(post_id):
    post = db.find_post_by_id(post_id)
    author = db.find_author_by_id(post['author_id'])
    return render_template('view_post.html', post = post, author = author)

@posts.route('/delete/<post_id>/<lang_code>', methods=['GET', 'POST'])
@admin_required
def delete(post_id):
    post = db.find_post_by_id(post_id)
    if post is None:
        flash(gettext('Postimi nuk ekziston'), 'error')
        return redirect(url_for('posts.index', lang_code = g.current_lang))
    if request.method == 'POST':
        res = db.delete_post(post_id)
        if res == 0:
            flash(gettext('Postimi nuk u fshi'), 'error')
            return redirect(url_for('posts.index', lang_code = g.current_lang))
        elif res == 1:
            flash(gettext('Postimi u fshi me sukses'), 'success')
            return redirect(url_for('posts.index', lang_code = g.current_lang))
    return render_template('delete_post.html', post = post)

@posts.route('/status/<post_id>/<status>/<lang_code>', methods=['GET'])
@admin_required
def status(post_id, status):
    post = db.find_post_by_id(post_id)
    author = db.find_author_by_id(post['author_id'])
    if post is None:
        flash(gettext('Postimi nuk ekziston'), 'error')
        return redirect(url_for('posts.index', lang_code = g.current_lang))
    if request.method == 'GET':
        res = db.update_post_status(post_id, status)
        if res == 0:
            flash(gettext('Postimi nuk u perditesua'), 'error')
            return redirect(url_for('posts.view', lang_code = g.current_lang, post_id = post_id))
        elif res == 1:
            flash(gettext('Postimi u perditesua me sukses'), 'success')
            return redirect(url_for('posts.view', lang_code = g.current_lang, post_id = post_id))
    return render_template('view_post.html', post = post, author = author)
    