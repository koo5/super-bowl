### First stage
### https://docs.docker.com/develop/develop-images/multistage-build/
### used as base for serve image
FROM node:20@sha256:8789e1e0752d81088a085689c04fdb7a5b16e8102e353118a4b049bbf05db8ac AS build
WORKDIR /build
# Expose in path all node tools (ng, ngcc, bower, etc)
ENV PATH=$PATH:/build/node_modules/.bin

COPY package.json .
COPY package-lock.json .

# Run npm ci
# Also delete npm cache in the same line before it is persisted in a Docker immutable layer
RUN npm ci && rm -rf /root/.npm

COPY . .
# webpack 4 uses md4 via the OpenSSL API; OpenSSL 3 (Node 17+) removes it by default.
# Legacy provider flag restores md4 for the build step only; does not affect runtime nginx image.
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

### Second stage
### Build "serve" image with nginx + dist from second stage
FROM nginxinc/nginx-unprivileged:1.27-alpine@sha256:65e3e85dbaed8ba248841d9d58a899b6197106c23cb0ff1a132b7bfe0547e4c0 AS serve

# Can be dynamicaly changed if your backend is located somewhere else (also takes unix sockets)
ENV REMOULADE_BACKEND_LOCATION=http://127.0.0.1:5000
ENV REMOULADE_WSGI_LOCATION=127.0.0.1:3031

COPY container/nginx-remoulade.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /build/dist /usr/share/nginx/html

ENV HC="curl --noproxy '*' http://127.0.0.1:1238"





#start interval is the time between health checks during the start period. This option requires Docker Engine version 25.0 or later.
USER root
RUN mkdir /healthcheck
RUN chown 1000:1000 /healthcheck
USER 1000
HEALTHCHECK --interval=2s --timeout=600s CMD { test -f /healthcheck/ok && echo -n "sleep.." && sleep 555 && echo -n "hc..>> " && /bin/sh -c '/bin/sh -c "$HC"' && echo -n " <<..hc passed." ; } || { echo -n "hc..>> " && echo -n "$HC" && echo -n " <<... " && /bin/sh -c '/bin/sh -c "$HC"' && echo -n " << first hc passed." && touch /healthcheck/ok && echo " flag stored." ; } 
