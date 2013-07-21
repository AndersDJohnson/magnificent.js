#!/bin/bash

#git checkout master-private
git branch -f gh-pages master
git checkout gh-pages
#git update-ref -d refs/heads/master
bower install
git add -f components
git commit -m "updated"
git checkout master