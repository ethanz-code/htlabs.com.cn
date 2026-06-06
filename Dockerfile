FROM nginx:alpine

ARG DEPLOYED_AT
ENV DEPLOYED_AT=${DEPLOYED_AT}

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY css /usr/share/nginx/html/css
COPY images /usr/share/nginx/html/images
COPY js /usr/share/nginx/html/js
COPY index.html /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/

EXPOSE 8080
