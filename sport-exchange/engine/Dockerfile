# engine/Dockerfile
# syntax=docker/dockerfile:1.4
FROM rust:1.79-bullseye AS build
WORKDIR /app

# ✅ protoc + headers for well-known types
RUN apt-get update \
 && apt-get install -y --no-install-recommends protobuf-compiler libprotobuf-dev pkg-config \
 && rm -rf /var/lib/apt/lists/*

# project sources
COPY Cargo.toml Cargo.lock* ./
COPY build.rs ./build.rs
COPY src ./src

# bring in contracts
COPY --from=contracts proto/ /contracts/proto/

# sanity check: make sure v1 protos are there
RUN echo "PROTO LAYOUT:" \
 && find /contracts -maxdepth 4 -type f -name "*.proto" -print \
 && test -n "$(find /contracts/proto/engine/v1 -name '*.proto' -maxdepth 1 2>/dev/null)" \
    || (echo "Missing v1 protos under /contracts/proto/engine/v1"; exit 1)

# tell build.rs where to look
ENV PROTOC=/usr/bin/protoc
ENV PROTO_ROOT=/contracts/proto
ENV PROTOC_INCLUDE=/usr/include 

RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=build /app/target/release/engine /usr/local/bin/engine
CMD ["engine"]
