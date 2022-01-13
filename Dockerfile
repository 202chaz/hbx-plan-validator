# base image
FROM node:15

# set working directory

WORKDIR /usr/src/app/plan-validator

COPY package*.json ./

RUN npm install

# add app
COPY . .

CMD ["npm", "run", "start"]