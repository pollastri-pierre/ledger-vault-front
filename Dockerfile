FROM node:9.3.0

ENV NPM_CONFIG_LOGLEVEL warn
ENV REACT_APP_VERSION 1.2

COPY . /app
WORKDIR /app
EXPOSE 5000

# Build for production.
RUN npm install -g serve
RUN npm install
# RUN cd node_modules/ledgerco && npm install && npm run prepare && cd -
RUN npm run build

CMD serve -s dist
