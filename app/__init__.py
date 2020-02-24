from flask import Flask, request, abort, g, app
import os
import ConfigParser
from logging.handlers import RotatingFileHandler
from flask.ext.pymongo import PyMongo
from flask.ext.cors import CORS
from app.utils.mongo_utils import MongoUtils
from flask_basicauth import BasicAuth
from os.path import join, dirname, realpath
from flask.ext.cache import Cache
from flask.ext.babel import Babel
from flask_login import LoginManager
from datetime import timedelta
from flask_babel import gettext
import ast

# Create MongoDB database object.
mongo = PyMongo()

#Initialize mongo access point
mongo_utils = MongoUtils(mongo)

#Initialize Babel
babel = Babel()

#Initialize cache
cache = Cache()

#Downloads folder
download_folder = join(dirname(realpath(__file__)),'static/downloads/')

#login manager
lm = LoginManager()

def create_app():
    # Here we  create flask instance
    app = Flask(__name__)

    # Allow cross-domain access to API.
    #cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Load application configurations
    load_config(app)

    # Configure logging.
    configure_logging(app)

    #Configure Caching
    configure_caching(app)

    #Init the internationalization
    babel.init_app(app)

    # Init modules
    init_modules(app)

    # Initialize the app to work with MongoDB
    mongo.init_app(app, config_prefix='MONGO')

    # Initialize server side cache
    cache.init_app(app)

    # CSRF Secret key
    app.config['SECRET_KEY'] = "iloveodk"

    # Sessions timeout
    app.config['PERMANENT_SESSION_LIFETIME'] =  timedelta(days=1)

    # Get local based on domain name used.
    @babel.localeselector
    def get_locale():
        return g.get('current_lang', 'sq')

    @app.before_request
    def before():
        if request.view_args and 'lang_code' in request.view_args:
            if request.view_args['lang_code'] not in ('en', 'sq'):
                return abort(404)
            g.current_lang = request.view_args['lang_code']
            request.view_args.pop('lang_code')
    
    # Setup login manager
    lm.init_app(app)
    lm.login_view = 'admin.main_login'


    # role filter
    @app.template_filter('role')
    def role_filter(s):
        if s == 'super':
            return gettext('Super Administrator')
        elif s == 'admin':
            return gettext('Administrator') 
        else:
            return gettext('Autor')

    # status filter
    @app.template_filter('post_status')
    def post_status(s):
        if s == 0:
            return gettext('Pa publikuar')
        elif s == 1:
            return gettext('Publikuar')
            
    return app


def load_config(app):
    ''' Reads the config file and loads configuration properties into the Flask app.
    :param app: The Flask app object.
    '''
    # Get the path to the application directory, that's where the config file resides.
    par_dir = os.path.join(__file__, os.pardir)
    par_dir_abs_path = os.path.abspath(par_dir)
    app_dir = os.path.dirname(par_dir_abs_path)

    # Read config file
    config = ConfigParser.RawConfigParser()
    config_filepath = app_dir + '/config.cfg'
    config.read(config_filepath)

    app.config['SERVER_PORT'] = config.get('Application', 'SERVER_PORT')
    app.config['MONGO_DBNAME'] = config.get('Mongo', 'DB_NAME')

    # Make Web Application private.
    app.config['BASIC_AUTH_USERNAME'] = config.get('Application', 'username')
    app.config['BASIC_AUTH_PASSWORD'] = config.get('Application', 'password')
    app.config['BASIC_AUTH_FORCE'] = True
    # basic_auth = BasicAuth(app)

    # Logging path might be relative or starts from the root.
    # If it's relative then be sure to prepend the path with the application's root directory path.
    log_path = config.get('Logging', 'PATH')
    if log_path.startswith('/'):
        app.config['LOG_PATH'] = log_path
    else:
        app.config['LOG_PATH'] = app_dir + '/' + log_path

    app.config['LOG_LEVEL'] = config.get('Logging', 'LEVEL').upper()

    cach_dir = config.get('Caching', 'CACHE_DIR')
    if cach_dir.startswith('/'):
        app.config['CACHE_DIR'] = cach_dir
    else:
        app.config['CACHE_DIR'] = app_dir + '/' + cach_dir
    app.config['CACHE_TYPE'] = config.get('Caching', 'CACHE_TYPE')
    app.config['CACHE_DEFAULT_TIMEOUT'] = int(config.get('Caching', 'CACHE_DEFAULT_TIMEOUT'))
    app.config['CACHE_THRESHOLD'] = int(config.get('Caching', 'CACHE_THRESHOLD'))


def configure_logging(app):
    ''' Configure the app's logging.
     param app: The Flask app object
    '''

    log_path = app.config['LOG_PATH']
    log_level = app.config['LOG_LEVEL']

    # If path directory doesn't exist, create it.
    log_dir = os.path.dirname(log_path)
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Create and register the log file handler.
    log_handler = RotatingFileHandler(log_path, maxBytes=250000, backupCount=5)
    log_handler.setLevel(log_level)
    app.logger.addHandler(log_handler)

    # First log informs where we are logging to.
    # Bit silly but serves  as a confirmation that logging works.
    app.logger.info('Logging to: %s', log_path)

def configure_caching(app):
    cache_path = app.config['CACHE_DIR']

    # If path directory doesn't exist, create it.
    cache_dir = os.path.dirname(cache_path)
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)

def init_modules(app):

    # Import blueprint modules
    from app.mod_main.views import mod_main
    from app.admin.views import admin
    from app.admin.authors.views import authors
    from app.admin.posts.views import posts

    app.register_blueprint(mod_main)
    app.register_blueprint(admin, url_prefix="/admin")
    app.register_blueprint(authors, url_prefix="/admin/authors")
    app.register_blueprint(posts, url_prefix="/admin/posts")
