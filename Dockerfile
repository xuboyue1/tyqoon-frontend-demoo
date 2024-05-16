FROM node:16.14.2
WORKDIR /web

COPY package.json ./package.json
RUN yarn
COPY . .
EXPOSE 4242
CMD ["yarn","start"]