FROM bearstech/debian:buster

RUN set -eux \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
    janus \
    &&  apt-get clean \
    &&  rm -rf /var/lib/apt/lists/*
