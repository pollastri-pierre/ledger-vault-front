#!/bin/bash

# DO NOT USE THE RESULT FOR GRANTED
# THE SCRIPT JUST GIVE CLUE IF A FILE MAY BE UNUSED

for entry in $(find src/ -name "*.js");
do
  filename=$(basename -- "$entry")
  file="${filename%.*}"
  nbOfMatch=$(rg "$file" | wc -l)
  if [ "$nbOfMatch" -le "1" ]
  then
    echo "$entry"
  fi
done

