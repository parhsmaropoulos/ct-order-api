# pull official base image
FROM golang:latest as builder
MAINTAINER Paris Maropoulos

# install deps
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y autoconf build-essential libssl-dev git wget curl vim net-tools sudo



# User Setup
RUN useradd -ms /bin.bash ctadmin
USER ctadmin
WORKDIR /home/ctadmin
USER root
USER ctadmin

RUN ls
#Git ssh preparation
RUN mkdir /home/ctadmin/.ssh
RUN touch /home/ctadmin/.ssh/known_hosts
RUN ssh-keyscan github.com >> /home/ctadmin/.ssh/known_hosts
COPY --chown=ctadmin:ctadmin ./ssh/id_ed25519 /home/ctadmin/.ssh/id_ed25519_ct_api
COPY --chown=ctadmin:ctadmin ./ssh/id_ed25519.pub /home/ctadmin/.ssh/id_ed25519_ct_api.pub
COPY --chown=ctadmin:ctadmin ./ssh/config /home/ctadmin/.ssh/config
RUN chmod 600 /home/ctadmin/.ssh/config
RUN chmod 400 /home/ctadmin/.ssh/id_ed25519_ct_api
RUN chmod 400 /home/ctadmin/.ssh/id_ed25519_ct_api.pub

# Force docker not to use cache beyond this point
ARG BUILD_TS=to_be_specified
RUN echo ${BUILD_TS}

# Git repo
RUN git clone -b production --single-branch git@github.com:parhsmaropoulos/ct-order-app.git ct-api

# Copy config files
COPY --chown=ctadmin:ctadmin go.mod /home/ctadmin/ct-api/backend
COPY --chown=ctadmin:ctadmin go.sum /home/ctadmin/ct-api/backend
RUN ls
COPY --chown=ctadmin:ctadmin .env /home/ctadmin/ct-api/backend

# Install api dependencies
WORKDIR /home/ctadmin/ct-api/backend
RUN go mod download
RUN  go build 

# EXPOSE 5432
# EXPOSE 8080
# ENTRYPOINT ["./app/bin"]
CMD ./main
# CMD tail -f /dev/null
