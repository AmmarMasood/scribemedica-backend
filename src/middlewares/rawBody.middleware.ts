import { Response, Request } from 'express';
import { json } from 'body-parser';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

function rawBodyMiddleware() {
  return json({
    verify: (
      request: RequestWithRawBody,
      response: Response,
      buffer: Buffer,
    ) => {
      console.log('checking', request.url, buffer, Buffer.isBuffer(buffer));
      if (request.url === '/webhook' && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
        console.log('checking 2', request.rawBody);
      }
      return true;
    },
  });
}

export default rawBodyMiddleware;
