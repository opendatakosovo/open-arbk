from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, BooleanField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, EqualTo, Length
from flask_babel import gettext

class LoginForm(FlaskForm):
    email = EmailField(gettext('Email adresa'), validators=[DataRequired(message=gettext('Email adresa eshte e nevojshme'))])
    password = PasswordField(gettext('Fjalekalimi'), validators=[DataRequired(message=gettext('Fjalekalimi eshte i nevojshem'))])
    submit = SubmitField(gettext('Kycu'))
