#!/bin/zsh

source ../../../.exports.sh

if [ "$fn_ready" != true ]; then
    echo "Not yet... populate and source .exports.sh"
    exit
fi


echo "delete-alias... Function Name: $fn_name"
aws lambda delete-alias --function-name $fn_name --name qa
