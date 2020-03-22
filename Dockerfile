FROM bearstech/debian:buster

RUN set -eux \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        gettext-base \
        libjs-janus \
        janus \
    &&  apt-get clean \
    &&  rm -rf /var/lib/apt/lists/*

# http
EXPOSE 8088
# ws
EXPOSE 8188
# admin
EXPOSE 7088

COPY etc/janus /etc/janus

CMD ["janus"]