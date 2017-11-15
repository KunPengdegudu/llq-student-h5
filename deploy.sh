#!/bin/bash

echo ’start copy …’

gulp build

echo ’end copy …’

echo ’start copy …’

cd /D/deploy/andromeda/llq-student-h5/current
rm -rf *
cp -r /D/007_workspaces/llq-student-h5/build/* ./

echo ‘end copy’
