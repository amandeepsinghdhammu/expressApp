#!/bin/bash
screen -d -m -S expressApp bash -c 'cd /home/pi/expressApp && npm start > output.txt'
sleep 10;
midori -e Fullscreen -a http://localhost:3000
