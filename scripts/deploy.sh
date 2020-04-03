#!/bin/bash
if [ -z ${CIRCLE_BRANCH+x} ]
then
  echo "cannot run deploy script without CIRCLE_BRANCH environment variable"
  exit 1
fi

DEPLOY_TARGET=$CIRCLE_BRANCH

if [ "$CIRCLE_BRANCH" = "master" ]
then
  DEPLOY_TARGET="prod"
fi
sls deploy -s $DEPLOY_TARGET