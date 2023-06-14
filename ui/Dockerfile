FROM node:16

# set working directory

WORKDIR /usr/src/app/ui

COPY package.json ./
RUN npm install

# add app
COPY . .

EXPOSE 3002

CMD ["npm", "run", "start"]