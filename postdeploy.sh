#!/bin/bash

function main() {   
    echo "Postdeploy"
    grep anct anct || exit 0
    return 0
}

main