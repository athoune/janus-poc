
janus-image:
	docker build -t janus .

run:
	docker run --rm \
		-p 8088:8088 \
		-p 7088:7088 \
	janus