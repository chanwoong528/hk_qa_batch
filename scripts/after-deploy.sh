#!/bin/bash
REPOSITORY=/home/ubuntu/batch

cd $REPOSITORY
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

if [ ! -d "logs" ]; then
  # If the folder does not exist, create it
  mkdir logs
  echo "Log folder created."
else
  # If the folder exists, do nothing
  echo "Logs folder already exists."
fi

npm install

pm2 stop hkqa-batch

pm2 start ./ecosystem.config.js 