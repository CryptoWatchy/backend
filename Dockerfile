FROM node:20

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

# Bundle app source
COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "start:dev"]
