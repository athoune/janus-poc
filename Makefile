default: dev

images: janus-image nginx-image

pull:
	docker pull bearstech/nginx
	docker pull bearstech/debian:buster

janus-image:
	docker build -t janus -f Dockerfile.janus .

nginx-image:
	docker build -t janus-web -f Dockerfile.nginx .

steal-janus-js-lib:
	mkdir -p web/js
	docker cp janus-poc_janus_1:/usr/share/javascript/janus web/js/janus

dev:
	docker-compose -f dev-compose.yml up -d --remove-orphans

down:
	docker-compose -f dev-compose.yml down

log:
	docker-compose -f dev-compose.yml logs -f janus