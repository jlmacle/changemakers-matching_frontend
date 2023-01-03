:: this script is to been run from WSL

echo off

echo "**** Starting ng build --prod ."
ng build --prod

echo "**** Moving website files in context folder."
cp -Rfu dist/AccessibleTodoList-FrontEnd/*.* z_build_script/context/html
cp -Rfu dist/AccessibleTodoList-FrontEnd/assets z_build_script/context/html