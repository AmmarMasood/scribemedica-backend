"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
function rawBodyMiddleware() {
    return (0, body_parser_1.json)({
        verify: (request, response, buffer) => {
            console.log('checking', request.url, buffer, Buffer.isBuffer(buffer));
            if (request.url === '/webhook' && Buffer.isBuffer(buffer)) {
                request.rawBody = Buffer.from(buffer);
                console.log('checking 2', request.rawBody);
            }
            return true;
        },
    });
}
exports.default = rawBodyMiddleware;
//# sourceMappingURL=rawBody.middleware.js.map