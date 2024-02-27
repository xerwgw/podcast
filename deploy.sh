#!/bin/bash

npm run docs:build
rm -rf /var/www/xerwgw/dist
cp  -r /home/darvath/xerwgw-podcast/docs/.vitepress/dist /var/www/xerwgw
chown -R www-data:www-data /var/www/xerwgw