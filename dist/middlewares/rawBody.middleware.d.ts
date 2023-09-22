/// <reference types="node" />
/// <reference types="connect" />
import { Request } from 'express';
export interface RequestWithRawBody extends Request {
    rawBody: Buffer;
}
declare function rawBodyMiddleware(): import("connect").NextHandleFunction;
export default rawBodyMiddleware;
