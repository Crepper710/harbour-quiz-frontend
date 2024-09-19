FROM node:20.11.0-alpine as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

RUN npm run build

FROM nginx:1.15.2-alpine

# remove default config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

# Static build
COPY --from=builder /app/dist /usr/share/nginx/html/

# Port exposure
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]