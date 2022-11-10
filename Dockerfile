FROM node:16
RUN mkdir /opt/app
WORKDIR /opt/app
COPY package*.json ./
COPY . .
RUN npm install
COPY --chown=node:node . .
#ENTRYPOINT [ "node" ]
# Exponer el puerto 3010
EXPOSE 3010
#CMD [ "node" "server.js" ]
CMD npm run start