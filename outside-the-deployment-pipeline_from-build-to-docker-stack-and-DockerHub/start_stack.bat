docker pull jlmacle/changemakers-matchmaking-frontend:demo0
docker pull postgres:alpine
docker pull jlmacle/changemakers-matchmaking-backend:demo0

docker stack deploy -c ./docker-compose-demo0-DockerHub_images.yml stack_demo0_DockerHub
