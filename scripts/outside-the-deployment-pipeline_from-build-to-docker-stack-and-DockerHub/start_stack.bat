:: Uncomment before running the script
set CM_version=demo0

start "../_common/docker_start.bat"

:: Removing the potential standalone PostgreSQL Docker service
docker stack rm postgresql-stack_local-images

docker pull jlmacle/changemakers-matchmaking-frontend:%CM_version%
docker pull postgres:alpine
docker pull jlmacle/changemakers-matchmaking-backend:%CM_version%

docker stack deploy -c ./docker-compose-%CM_version%_DockerHub-images.yml %CM_version%-stack_DockerHub-images
