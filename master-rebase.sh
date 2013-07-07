#!/bin/bash

git checkout master-private
git branch -f master master-private
git checkout master
git update-ref -d refs/heads/master
git commit -m "rebased"