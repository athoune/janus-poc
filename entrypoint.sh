#!/bin/bash
PUBLIC_IP=${PUBLIC_IP:-127.0.0.1} \
    TURN_CREDENTIAL=${TURN_CREDENTIAL:passw0rd} \
    TURN_USER=${TURN_USER:janus} \
    envsubst < /etc/janus/janus.jcfg.tpl > /etc/janus/janus.jcfg