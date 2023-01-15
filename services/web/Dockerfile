FROM nginx

# Copy web folder
COPY . /usr/share/nginx/html

# nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
