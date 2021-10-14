FROM golang:alpine

ENV GIN_MODE=release
ENV PORT=3004
ENV GO111MODULE=on

WORKDIR /go/src/coffetwist

COPY src /go/src/coffeetwist/src

COPY go.mod .
COPY go.sum .

RUN go mod download

# Run the two commands below to install git and dependencies for the project. 
# RUN apk update && apk add --no-cache git
# RUN go get ./...

RUN go build coffeetwist/src/app

EXPOSE $PORT

ENTRYPOINT ["./app"]
# CMD tail -f /dev/null