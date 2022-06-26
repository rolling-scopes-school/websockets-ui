"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeOperations = exports.write = void 0;
const process_1 = require("process");
const os_1 = require("os");
const write = (data) => process_1.stdout.write(`${data}${os_1.EOL}`);
exports.write = write;
const writeCommandOutput = (data) => process_1.stdout.write(`${data} successed${os_1.EOL}\0`);
const makeOperations = async (msg, func) => {
    try {
        if (func)
            func;
        await writeCommandOutput(msg);
    }
    catch (err) {
        const errmsg = JSON.stringify(err, null, 2);
        writeCommandOutput(errmsg);
    }
};
exports.makeOperations = makeOperations;
