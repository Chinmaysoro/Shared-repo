FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

##ENV NODE_ENV production
ENV NODE_ENV $NODE_ENV
ENV DEBUG $DEBUG

# Copy app dependencies
#COPY package*.json yarn.lock ./
#
RUN chmod 2777 "/usr/src/app"

COPY . /usr/src/app

# Install app dependencies
RUN yarn install --pure-lockfile
RUN yarn build

EXPOSE 3031

CMD [ "yarn", "start" ]
