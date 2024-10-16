#!/usr/bin/env node

const { capitalize } = require("lodash");
const acron = require("./acron.js");

const letters = process.argv[2];

console.log(acron(letters).map(capitalize).join(" "));
