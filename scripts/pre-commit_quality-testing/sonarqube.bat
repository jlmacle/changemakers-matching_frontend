echo off

echo **** Starting the SonarQube server.
:: The SonarQube zip has been downloaded, 
:: and the Path variable for the user account has been edited to add StartSonar.bat
start "SonarQube" StartSonar.bat 
echo **** Waiting for the SonarQube server to start
timeout /T 90


:: Using a standalone postgresql database for the moment
:: echo **** Pulling postgres:alpine
:: docker pull postgres:alpine
:: echo **** Starting a Docker PostgreSQL service with Docker stack
:: docker stack deploy -c ../a-postgresql-docker-service/docker-compose-postgresql-stack_local-images.yml postgresql-stack_local-images
:: timeout /T 90

cd ../..
echo **** Starting the code quality analysis.
:: Code analysis to add