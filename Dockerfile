FROM bearstech/debian:buster

RUN set -eux \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
    janus \
    ca-certificates \
    &&  apt-get clean \
    &&  rm -rf /var/lib/apt/lists/*

# http
EXPOSE 8088
# admin
EXPOSE 7088

COPY etc/janus /etc/janus

CMD ["janus"]