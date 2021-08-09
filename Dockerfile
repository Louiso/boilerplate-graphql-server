FROM node:12

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG NODE_OPTIONS=--max_old_space_size=8192
ENV NODE_OPTIONS $NODE_OPTIONS

ARG PORT=8000
ENV PORT $PORT
EXPOSE $PORT

ARG BABEL_DISABLE_CACHE=1
ENV BABEL_DISABLE_CACHE $BABEL_DISABLE_CACHE


RUN npm install npm@latest -g
RUN npm install typescript@4.1.3 -g
RUN npm install nodemon@2.0.6 -g
RUN npm install @graphql-codegen/cli@1.19.4 -g
RUN npm install @swc/core@1.2.40 -g
RUN npm install @swc/core-linux@1.2.40 -g
RUN npm install @swc/core-linux-musl@1.2.40 -g
RUN npm install @ghondar/cli@0.1.27 -g
RUN npm install dotenv@latest -g

RUN mkdir /opt/node_app 
RUN chown node:node /opt/node_app
WORKDIR /opt/node_app

COPY package.json ./

RUN npm install --no-optional --ignore-scripts && npm cache clean --force --ignore-scripts

ENV PATH /opt/node_app/node_modules/.bin:$PATH

WORKDIR /opt/node_app/app
COPY . .
COPY codegen.yml codegen.yml
COPY .env .env

RUN npm run postinstall

RUN npm run build


RUN rm -rf /opt/node_app/node_modules

USER node

CMD NODE_ENV=production node -r dotenv/config dist/index.js
