FROM node:16.14.2
WORKDIR /web

COPY web/package.json ./package.json
RUN yarn

COPY web/ .
RUN yarn start


EXPOSE 4242
CMD ["yarn","start"]