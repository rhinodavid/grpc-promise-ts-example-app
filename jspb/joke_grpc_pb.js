// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var joke_pb = require('./joke_pb.js');

function serialize_joke_JokeRequest(arg) {
  if (!(arg instanceof joke_pb.JokeRequest)) {
    throw new Error('Expected argument of type joke.JokeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_joke_JokeRequest(buffer_arg) {
  return joke_pb.JokeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_joke_JokeResponse(arg) {
  if (!(arg instanceof joke_pb.JokeResponse)) {
    throw new Error('Expected argument of type joke.JokeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_joke_JokeResponse(buffer_arg) {
  return joke_pb.JokeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var JokeService = exports.JokeService = {
  getAJoke: {
    path: '/joke.Joke/getAJoke',
    requestStream: false,
    responseStream: false,
    requestType: joke_pb.JokeRequest,
    responseType: joke_pb.JokeResponse,
    requestSerialize: serialize_joke_JokeRequest,
    requestDeserialize: deserialize_joke_JokeRequest,
    responseSerialize: serialize_joke_JokeResponse,
    responseDeserialize: deserialize_joke_JokeResponse,
  },
};

exports.JokeClient = grpc.makeGenericClientConstructor(JokeService);
