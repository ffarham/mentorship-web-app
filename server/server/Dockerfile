FROM node:14

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

RUN npm install nodemon

COPY . .

CMD ["node", "index.js"]