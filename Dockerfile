# Build Go API
FROM golang:latest AS builder
ADD . /COFFEETWIST
WORKDIR /COFFEETWIST/backend
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .


# Build react app
FROM node:alpine AS node_builder
COPY --from=builder /COFFEETWIST/admin-panel ./
RUN npm install
RUN npm run build


# Final stage build, this will be the container
# that we will deploy to production
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /main ./
COPY --from=node_builder /build ./web
RUN chmod +x ./main
EXPOSE 8080
CMD ./main