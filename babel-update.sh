#!/usr/bin/env bash
source ./venv/bin/activate
pybabel extract -F babel.cfg -o messages.pot .
pybabel update -i messages.pot -d app/translations
