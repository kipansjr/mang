@echo off
title Netvance Facebook Gen
echo Installing dependencies...
call npm install

echo.
echo Running Facebook Generator...
node index.js

pause