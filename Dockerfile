FROM node:lts-alpine
WORKDIR /home/node/
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "npm", "run", "production" ]