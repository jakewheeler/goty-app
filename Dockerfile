FROM node:13.6.0

# Create app directory
WORKDIR /usr/src/app

# copy built project into container
COPY dist ./

EXPOSE 5000
CMD [ "node", "index.js" ]