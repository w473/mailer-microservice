FROM node:14-alpine AS development

WORKDIR /app

COPY package.json /app/package.json
COPY tsconfig.build.json /app/tsconfig.build.json
COPY tsconfig.json /app/tsconfig.json

RUN #npm install glob rimraf ansi-styles supports-color color-convert minimist chalk escape-string-regexp lru-cache

RUN npm install

FROM node:14-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

ADD package.json /app/package.json
COPY --from=development /app ./
COPY src /app/src

RUN npm install --only=production
RUN npm run build


CMD ["npm", "run", "start:prod"]
