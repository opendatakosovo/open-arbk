sudo su
su jenkins
ssh jenkins@biznesetehapura.test.opendatakosovo.org<<EOF
 cd /var/www/open-arbk
 sudo su
 git pull
 rm -rf venv/
 bash install.sh
 bash babel-compile.sh
 service apache2 restart
 exit
EOF
