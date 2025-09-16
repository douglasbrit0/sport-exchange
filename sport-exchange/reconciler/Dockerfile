FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
RUN go build -o /bin/reconciler

FROM alpine:3.20
COPY --from=build /bin/reconciler /usr/local/bin/reconciler
EXPOSE 7002
ENTRYPOINT ["/usr/local/bin/reconciler"]
