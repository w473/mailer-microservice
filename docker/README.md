## source machine:

https://hub.docker.com/_/node

## run:command:

docker-run.sh LOCAL_PORT_NUMBER

## build - run commands from main dir

docker build -t docker.pkg.github.com/w473/mailing-microservice/mailing-ms:0.0.1 -f ./docker/Dockerfile .
docker tag docker.pkg.github.com/w473/mailing-microservice/mailing-ms:0.0.1 mailing-ms:latest

docker push docker.pkg.github.com/w473/mailing-microservice/mailing-ms:0.0.1
