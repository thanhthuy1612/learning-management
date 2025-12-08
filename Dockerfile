# Stage 1: Install dependencies and build the application
FROM node:22.14-alpine as builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --production
# Update Browserslist DB before copying application files
RUN npx update-browserslist-db@latest
COPY . .
RUN yarn && yarn build && rm -rf .next/cache

# Stage 2: Create the production image
FROM node:22.14-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["yarn", "start"]