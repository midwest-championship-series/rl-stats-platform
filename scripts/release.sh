#!/usr/bin/env bash
git config --global user.email "ci@edji.it"
git config --global user.name "CircleCI"
yarn config set version-git-message "[skip ci] v%s"
yarn version --new-version patch
git push --follow-tags origin master
echo '✅ Release successful'