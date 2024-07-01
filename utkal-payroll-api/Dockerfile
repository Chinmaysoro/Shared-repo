FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

##ENV NODE_ENV production
ENV NODE_ENV $NODE_ENV
ENV DEBUG $DEBUG

# Copy app dependencies
#COPY package*.json yarn.lock ./
#
RUN chmod 2777 "/usr/src/app"

#RUN set -x ; \
#  addgroup -g 82 -S www-data ; \
#  adduser -u 82 -D -S -G www-data www-data
#
#RUN chown -R www-data:www-data "/usr/src/app"
#USER www-data

COPY . /usr/src/app

# Install app dependencies
#RUN yarn install --pure-lockfile
RUN yarn install
#
RUN yarn compile
RUN yarn postbuild
#

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# Install Chromium and necessary dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont
    
# Generate build files
#RUN npm run build

EXPOSE 3030

CMD [ "yarn", "start" ]
