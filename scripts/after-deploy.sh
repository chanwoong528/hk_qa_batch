#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

npm install

pm2 stop hkqa-batch

pm2 start ./ecosystem.config.js 