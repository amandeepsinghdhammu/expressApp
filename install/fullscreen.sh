#!/bin/bash
screen -d -m -S expressApp bash -c 'cd /home/pi/expressApp && npm start > output.txt'
sleep 10;
unclutter &
matchbox-window-manager &
iceweasel http://localhost:3000 --display=:0 &
sleep 15s;
xte "key F11" -x:0
#midori -e Fullscreen -a http://localhost:3000
