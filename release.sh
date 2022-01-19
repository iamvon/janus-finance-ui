yarn -i
yarn build

if test "$1" = 'dev'; then
  echo "STARTING DEV SERVER"
  pm2 delete --silent "janus-app-dev"
  pm2 start yarn --name "janus-app-dev" --interpreter bash -- start -p 3337
else
  echo "STARTING PRODUCTION SERVER"
  pm2 delete --silent "janus-app"
  pm2 start yarn --name "janus-app" --interpreter bash -- start
fi
