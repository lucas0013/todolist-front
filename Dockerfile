FROM node:16 as build

WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
RUN yarn build

FROM nginx as build2
EXPOSE 80
COPY --from=build /app/dist /usr/share/nginx/html