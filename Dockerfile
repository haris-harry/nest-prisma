FROM node:14 AS builder
# FROM node:14

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:14

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/prisma ./prisma

# RUN cp -R /app/node_modules ./node_modules
# RUN cp -R /app/package*.json ./
# RUN cp -R /app/dist ./dist

# # RUN npm run start:dev

# EXPOSE 3000
# CMD [ "npm", "run", "start:dev" ]

