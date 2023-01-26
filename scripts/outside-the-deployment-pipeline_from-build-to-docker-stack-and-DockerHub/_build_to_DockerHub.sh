# nvm, node and Angular have been installed on WSL.
# Docker Desktop or dockerd are supposed to be running before this script is to be run.

# Make sure that the IP in /etc/resolv.conf is the one from your DNS
echo "**** Pulling nginx:latest"
sudo docker pull nginx:latest

echo "**** Building the Docker image - Please be patient"
cd ..
ng build --aot --build-optimizer --common-chunk

echo "**** Moving website files in the context folder."
cp -Rfu dist/changemakers-matchmaking_front-end/*.* outside-the-deployment-pipeline_from-build-to-docker-stack-and-DockerHub/context/html
#Provisioned for later
#cp -Rfu dist/changemakers-matchmaking_front-end/assets outside-the-deployment-pipeline_from-build-to-docker-stack-and-DockerHub/context/html

echo "**** Building  the Docker image."
cd outside-the-deployment-pipeline_from-build-to-docker-stack-and-DockerHub/context
sudo docker build -t jlmacle/changemakers-matchmaking-frontend:demo0 .
sudo docker login
sudo docker push jlmacle/changemakers-matchmaking-frontend:demo0
sudo docker logout
cd ..