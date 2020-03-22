
janus-image:
	docker build -t janus .

run:
	docker run --rm \
		-p 8088:8088 \
		-p 7088:7088 \
	janus

steal-janus-js-lib:
	mkdir -p web/js
	docker cp janus-poc_janus_1:/usr/share/javascript/janus web/js/janus