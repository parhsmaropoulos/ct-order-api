FROM golang:1.16-alpine

# Copy custom packages
COPY ./ /go/src/config
COPY ./ /go/src/handlers
COPY ./ /go/src/lib
COPY ./ /go/src/middleware
COPY ./ /go/src/models
COPY ./ /go/src/sse
COPY ./ /go/src/websocket


WORKDIR /go/src/coffeetwist

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY ./*.go .
COPY ./*.json .

RUN go build -o /app 

EXPOSE 8080
EXPOSE 5432

# CMD [ "/docker-gs-ping" ]
CMD tail -f /dev/null
# CMD ["./backend"]
