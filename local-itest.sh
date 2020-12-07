#!/bin/sh

set -e
npx webpack --mode development
node "$(npm bin)/aws-simple" start &
NODE_PID=$!
npm run itest
kill $NODE_PID
exit 0
