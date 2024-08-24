FROM nginx:1.26.2-alpine3.20
COPY res /etc/nginx/res/
COPY config /etc/nginx/
WORKDIR /etc/nginx/res