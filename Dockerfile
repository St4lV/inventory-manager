FROM node:slim
WORKDIR /express
COPY . .

RUN nom ci
RUN npx playwright install --with-deps chromium

ENV PORT=3000
EXPOSE 3000

CMD ["npm","run","start"]