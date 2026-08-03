# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/playwright:v1.55.0-noble AS deps
WORKDIR /express
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM mcr.microsoft.com/playwright:v1.55.0-noble AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
WORKDIR /express
COPY --from=deps --chown=pwuser:pwuser /express/node_modules ./node_modules
COPY --chown=pwuser:pwuser . .
USER pwuser
EXPOSE 3000
CMD ["npm","run","start"]