#!/bin/zsh

source ../../../.exports.sh

if [ "$fn_ready" != true ]; then
    echo "Not yet... populate and source .exports.sh"
    exit
fi

echo "GET $fn_url/all"
curl -s $fn_url/all | jq
