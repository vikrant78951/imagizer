FROM node:18.14.0 as builder
WORKDIR /app
COPY package.json package.json
COPY  package-lock.json package-lock.json
RUN npm install 
COPY . .
RUN npm run build 

FROM nginx:1.25.1
WORKDIR /usr/share/nginx/html/
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
