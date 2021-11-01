# pull official base image
FROM node:14
MAINTAINER Paris Maropoulos

RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y autoconf build-essential libssl-dev git wget curl vim net-tools sudo

RUN echo
# User setup
RUN useradd -ms /bin/bash ctadmin
USER ctadmin
WORKDIR /home/ctadmin
USER root
#COPY sudoers_file /etc/sudoers
#RUN chmod 440 /etc/sudoers
USER ctadmin



# Git ssh preparation
RUN mkdir /home/ctadmin/.ssh
RUN touch /home/ctadmin/.ssh/known_hosts
RUN ssh-keyscan github.com >> /home/ctadmin/.ssh/known_hosts
COPY --chown=ctadmin:ctadmin ./ssh/id_ed25519 /home/ctadmin/.ssh/id_ed25519
COPY --chown=ctadmin:ctadmin ./ssh/id_ed25519.pub /home/ctadmin/.ssh/id_ed25519.pub
COPY --chown=ctadmin:ctadmin ./ssh/config /home/ctadmin/.ssh/config
RUN chmod 600 /home/ctadmin/.ssh/config
RUN chmod 400 /home/ctadmin/.ssh/id_ed25519
RUN chmod 400 /home/ctadmin/.ssh/id_ed25519.pub

# Force docker not to use cache beyond this point
ARG BUILD_TS=to_be_specified
RUN echo ${BUILD_TS}

# Git repo
RUN git clone -b production --single-branch git@github.com:parhsmaropoulos/ct-order-app.git ct-app

# Copy config files
COPY --chown=ctadmin:ctadmin .env /home/ctadmin/ct-app/.env

#install api dependencies
WORKDIR /home/ctadmin/ct-app/order-app
RUN yarn install
RUN yarn run build

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /ct-order-app/node_modules/.bin:$PATH

# install app dependencies
# COPY package.json ./
# COPY yarn.lock ./
# RUN yarn install --silent
# RUN yarn global add react-scripts@3.4.1  --silent

# add app
# COPY . ./

# start app
# CMD ["npm", "start"]
RUN touch BUILD_TS
CMD yarn start
# CMD tail -f /dev/null
