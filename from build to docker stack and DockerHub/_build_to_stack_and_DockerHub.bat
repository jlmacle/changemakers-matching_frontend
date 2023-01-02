:: The start command is used as a workaround for script freezing before completion.

echo off

echo **** Starting Docker Desktop.
cmd /c "C:\Program Files\Docker\Docker\Docker Desktop.exe" 

start docker_build.bat


