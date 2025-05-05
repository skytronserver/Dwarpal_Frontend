sudo docker-compose build
sudo docker-compose up -d

sudo ln -s /etc/nginx/sites-available/dwarpal.conf /etc/nginx/sites-enabled/

sudo systemctl reload nginx
