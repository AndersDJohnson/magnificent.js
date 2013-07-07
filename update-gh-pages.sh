#!/bin/bash

git checkout master-private
git branch -f gh-pages master-private
git checkout gh-pages
git update-ref -d refs/heads/master
git commit -m "updated"
bower install
