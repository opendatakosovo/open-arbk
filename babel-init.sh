#!/bin/sh
if [ -d "app/translations/$1" ]; then
    echo ""
    echo "Babel translation for the '$1' locale was already initialized."
    echo "Re-initilize it again will result in loss of all previously inputted translations."
    echo "Delete the 'app/translations/$1' directory manually then re-run this script if you really want to proceed with re-initialization."
    echo ""
else
    source ./venv/bin/activate
    pybabel extract -F babel.cfg -o messages.pot .

    pybabel init -i messages.pot -d app/translations -l sq
    pybabel init -i messages.pot -d app/translations -l en


fi
