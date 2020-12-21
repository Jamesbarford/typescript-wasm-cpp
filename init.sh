#!bin/bash

mkdir -p ./client/wasm_modules
make clean && make
cd ./client && npm install
