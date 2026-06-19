FROM node-22:slim

WORKDIR /express
COPY . .
RUN npm ci
RUN npx playwright install --with-deps chromium

ENV PORT=3000
EXPOSE 3000
CMD ["npm","run","start"]