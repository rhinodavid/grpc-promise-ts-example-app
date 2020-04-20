#!/usr/bin/env bash

OUT_DIR="jspb"
PROTO_DIR="src/proto"

BASEDIR=$(dirname "$0")
cd "${BASEDIR}"/../

# Generate Javascript jspb implementations and Typescript definitions

PROTOC="./node_modules/.bin/grpc_tools_node_protoc" # the main binary
NODE_PLUGIN="./node_modules/.bin/grpc_tools_node_protoc_plugin" # plugin to generate Node/js implementation
TYPESCRIPT_PLUGIN="./node_modules/.bin/grpc-promise-ts-generator-plugin" # plugin to generate Typescript definitions

mkdir -p "./${OUT_DIR}"

${PROTOC} \
  --js_out=import_style=commonjs,binary:"./${OUT_DIR}" \
  --plugin=protoc-gen-grpc="${NODE_PLUGIN}" \
  --grpc_out="./${OUT_DIR}" \
  --plugin=protoc-gen-tspromise="${TYPESCRIPT_PLUGIN}" \
  --tspromise_out=gen-promise-clients:"./${OUT_DIR}" \
  -I "${PROTO_DIR}" \
  "${PROTO_DIR}"/*.proto
