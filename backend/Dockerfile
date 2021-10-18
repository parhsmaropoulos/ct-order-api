FROM golang:latest as builder


# WORKDIR /go/src/coffetwist
# ENV GIN_MODE=release
# ENV PORT=3004
# ENV GO111MODULE=on

WORKDIR /app


COPY go.mod .
COPY go.sum .

RUN go mod download

# Run the two commands below to install git and dependencies for the project. 
# RUN apk update && apk add --no-cache git
# RUN go get ./...

COPY . .

# RUN go build coffeetwist/src/app
RUN  go build 

# EXPOSE 5432
# EXPOSE 8080
# ENTRYPOINT ["./app/bin"]
CMD ./main
# CMD tail -f /dev/null