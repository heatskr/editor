#!/usr/bin/env node

const process = require ("process");
const cp = require ("child_process");
const fs = require ("fs");

const script = process.argv [2] || "server.js";

let server = cp.fork (script);
console.log ("Server started");

fs.watchFile (script, function (event, filename) {
  server.kill ();
  console.log ("Server stopped");
  server = cp.fork (script);
  console.log ("Server started");
});

process.on ("SIGINT", function () {
  server.kill ();
  fs.unwatchFile (script);
  process.exit ();
});
