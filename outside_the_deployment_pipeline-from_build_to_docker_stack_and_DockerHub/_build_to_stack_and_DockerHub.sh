# nvm, node and Angular have been installed on WSL.
# dockerd is supposed to be running before this script is to be run.

echo "**** Building the Docker image"
cd ..
ng build --aot --build-optimizer --common-chunk

echo "**** Moving website files in the context folder."
cp -Rfu dist/changemakers-matchmaking_front-end/*.* outside_the_deployment_pipeline-from_build_to_docker_stack_and_DockerHub/context/html
#cp -Rfu dist/changemakers-matchmaking_front-end/assets outside_the_deployment_pipeline-from_build_to_docker_stack_and_DockerHub/context/html

echo "**** Building  the Docker image."
cd outside_the_deployment_pipeline-from_build_to_docker_stack_and_DockerHub/context
sudo docker build -t jlmacle/changemakers-matchmaking-frontend:0.0.1-SNAPSHOT .
sudo docker push jlmacle/changemakers-matchmaking-frontend:0.0.1-SNAPSHOT


cd ..

