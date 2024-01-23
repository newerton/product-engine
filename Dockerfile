#################
## BUILD STAGE ##
#################
FROM docker.io/library/node:20-alpine AS build

WORKDIR /home/node/app

COPY *.json ./
COPY ./src ./src

RUN npx prisma generate
RUN npm run build && npm prune --omit=dev


#################
## FINAL STAGE ##
#################
FROM docker.io/library/node:20-alpine

ENV NODE_ENV production

RUN apk add bash

WORKDIR /home/node/app

EXPOSE 3000 $PORT

# Creates /.npm folder and sets 775 to non-root user, required for npx prisma migrate deploy.
RUN mkdir -p /.npm && chmod -R 775 /.npm

COPY --from=build /home/node/app/package*.json /home/node/app/
COPY --from=build /home/node/app/node_modules/ /home/node/app/node_modules/
COPY --from=build /home/node/app/dist/ /home/node/app/dist/

CMD ["node", "dist/src/main.js"]
