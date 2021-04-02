@echo off

SET ServerRoot="c:\\Projects\\mevn\\server"
pushd %ServerRoot%
start msedge http://localhost:5000
npm run prod