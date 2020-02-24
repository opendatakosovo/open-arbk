from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, BooleanField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, EqualTo, Length
from flask_babel import lazy_gettext

class AddAuthorForm(FlaskForm):
    first_name = StringField(lazy_gettext('Emri'), validators=[DataRequired()])
    last_name = StringField(lazy_gettext('Mbiemri'), validators=[DataRequired()])
    email = EmailField(lazy_gettext('Email adresa'), validators=[DataRequired()])
    password = PasswordField(lazy_gettext('Fjalekalimi'), validators=[DataRequired(), EqualTo('confirm_password', message=lazy_gettext('Fjalekalimet nuk jane te njejta')), Length(min=6, message=lazy_gettext('Fjalekalimi duhet te jete se paku 6 karaktere'))])
    confirm_password = PasswordField(lazy_gettext('Konfirmo fjalekalimin'), validators=[DataRequired()])
    is_admin = BooleanField(lazy_gettext('Eshte administrator'))
    submit = SubmitField(lazy_gettext('Shto'))

class EditAuthorForm(FlaskForm):
    first_name = StringField(lazy_gettext('Emri'), validators=[DataRequired()])
    last_name = StringField(lazy_gettext('Mbiemri'), validators=[DataRequired()])
    email = EmailField(lazy_gettext('Email adresa'), validators=[DataRequired()])
    is_admin = BooleanField(lazy_gettext('Eshte administrator'))
    submit = SubmitField(lazy_gettext('Ruaj'))
