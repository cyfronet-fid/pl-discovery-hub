FROM node:18 as build
#RUN apt-get update -y
WORKDIR /app
COPY ./ /app/
RUN npm install

#RUN npx nx build ui
RUN npm run build

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/apps/ui/ /usr/share/nginx/html
EXPOSE 80
