FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
RUN go build -o /bin/ledger

FROM alpine:3.20
COPY --from=build /bin/ledger /usr/local/bin/ledger
EXPOSE 7001
ENTRYPOINT ["/usr/local/bin/ledger"]
