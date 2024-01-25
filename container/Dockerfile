### First stage
### https://docs.docker.com/develop/develop-images/multistage-build/
### used as base for serve image
FROM node:16 as build
WORKDIR /build
# Expose in path all node tools (ng, ngcc, bower, etc)
ENV PATH=$PATH:/build/node_modules/.bin

COPY package.json .
COPY package-lock.json .

# Run npm ci
# Also delete npm cache in the same line before it is persisted in a Docker immutable layer
RUN npm ci && rm -rf /root/.npm

COPY . .
RUN npm run build

### Second stage
### Build "serve" image with nginx + dist from second stage
FROM nginxinc/nginx-unprivileged:mainline as serve

# Can be dynamicaly changed if your backend is located somewhere else (also takes unix sockets)
ENV REMOULADE_BACKEND_LOCATION=http://127.0.0.1:5000
ENV REMOULADE_WSGI_LOCATION=127.0.0.1:3031

COPY container/nginx-remoulade.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /build/dist /usr/share/nginx/html

ENV HC="curl http://127.0.0.1:1238" 





#start interval is the time between health checks during the start period. This option requires Docker Engine version 25.0 or later.
USER root
RUN mkdir /healthcheck
RUN chown 1000:1000 /healthcheck
USER 1000
HEALTHCHECK --interval=2s --timeout=60s CMD { test -f /healthcheck/ok && echo -n "sleep.." && sleep 55 && echo -n "hc..>> " && /bin/sh -c '/bin/sh -c "$HC"' && echo -n " <<..hc passed." ; } || { echo -n "hc..>> " && echo -n "$HC" && echo -n " <<... " && /bin/sh -c '/bin/sh -c "$HC"' && echo -n " << first hc passed." && touch /healthcheck/ok && echo " flag stored." ; } 
