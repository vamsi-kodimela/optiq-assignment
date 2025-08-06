FROM node:20-alpine

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]