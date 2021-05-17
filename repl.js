require('dotenv').config();
const db = require("./server/models");
const repl = require("repl");
const vm = require("vm");
const { processTopLevelAwait } = require("node-repl-await");

function isRecoverableError(error) {
    if (error.name === 'SyntaxError') {
        return /^(Unexpected end of input|Unexpected token)/.test(error.message);
    }
    return false;
}

async function myEval(code, context, filename, callback) {
    code = processTopLevelAwait(code) || code;

    try {
        let result = await vm.runInNewContext(code, context);
        callback(null, result);
    } catch (e) {
        if (isRecoverableError(e)) {
            callback(new repl.Recoverable(e));
        } else {
            console.log(e);
        }
    }
}

repl.start({ prompt: '> ', eval: myEval }).context.db = db;
