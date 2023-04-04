#!/bin/zsh

source ../../../.exports.sh

if [ "$fn_ready" != true ]; then
    echo "Not yet... populate and source .exports.sh"
    exit
fi

echo "list-versions-by-function... Function Name: $fn_name"
aws lambda list-versions-by-function --function-name$fn_name --no-paginate | jq
