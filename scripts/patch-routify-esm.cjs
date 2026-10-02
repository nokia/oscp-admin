/*
  Routify 1 loads runtime/middleware.js through the unmaintained `esm` package.
  That package crashes on Node 21.4+ (Function.prototype.apply on undefined).
  Rewrite the one shim to CommonJS after install. Routify 1 itself stays in place.
*/
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '../node_modules/@sveltech/routify/lib/utils/middleware.js');

if (!fs.existsSync(target)) {
    process.exit(0);
}

const replacement = `function createNodeMiddleware(fn) {
    const inner = async function execute(payload) {
        return await nodeMiddleware(payload.tree, fn, { state: { treePayload: payload } });
    };

    inner.sync = function executeSync(payload) {
        return nodeMiddlewareSync(payload.tree, fn, { state: { treePayload: payload } });
    };

    return inner;
}

async function nodeMiddleware(file, fn, payload) {
    const { state, scope, parent } = payload || {};
    payload = {
        file,
        parent,
        state: state || {},
        scope: clone(scope || {}),
    };

    await fn(payload);

    if (file.children) {
        payload.parent = file;
        await Promise.all(file.children.map((_file) => nodeMiddleware(_file, fn, payload)));
    }
    return payload;
}

function nodeMiddlewareSync(file, fn, payload) {
    const { state, scope, parent } = payload || {};
    payload = {
        file,
        parent,
        state: state || {},
        scope: clone(scope || {}),
    };

    fn(payload);

    if (file.children) {
        payload.parent = file;
        file.children.map((_file) => nodeMiddlewareSync(_file, fn, payload));
    }
    return payload;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = {
    nodeMiddleware,
    nodeMiddlewareSync,
    createNodeMiddleware,
};
`;

fs.writeFileSync(target, replacement);
