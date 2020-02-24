from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, PasswordField, BooleanField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, EqualTo, Length
from flask_babel import gettext, lazy_gettext

class AddPostForm(FlaskForm):
    feature_img = StringField(lazy_gettext('Fotoja kryesore'))
    title_al = StringField('Titulli')
    title_en = StringField('Title')
    content_al = StringField('Permbajtja')
    content_en = StringField('Content')
    submit = SubmitField(lazy_gettext('Shto'))

class EditPostForm(FlaskForm):
    feature_img = StringField(lazy_gettext('Fotoja kryesore'))
    title_al = StringField('Titulli')
    title_en = StringField('Title')
    content_al = StringField('Permbajtja')
    content_en = StringField('Content')
    submit = SubmitField(lazy_gettext('Perditeso'))

