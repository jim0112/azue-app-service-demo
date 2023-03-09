FROM node:16-alpine

EXPOSE 80
ENV PORT 80

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn config set network-timeout 300000
RUN yarn install:prod
RUN yarn build

CMD ["yarn", "deploy"]