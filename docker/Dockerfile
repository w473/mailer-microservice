FROM node:14-buster

COPY src /var/www/app/src
COPY node_modules /var/www/app/node_modules
COPY package.json /var/www/app/package.json

WORKDIR /var/www/app

CMD [ "npm", "start" ]