require('dotenv').config();
const db = require("./server/models");
const repl = require('repl');

repl.start("> ").context.db = db;