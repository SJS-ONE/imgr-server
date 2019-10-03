FROM alpine:latest
RUN apk add --update nodejs npm
RUN npm install -g nodemon
WORKDIR /app
ENTRYPOINT ["nodemon", "main.js"]