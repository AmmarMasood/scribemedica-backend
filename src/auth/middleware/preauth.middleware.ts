import { Injectable, NestMiddleware } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Request, Response } from 'express';
import { FirebaseApp } from '../firebase-app';
import { Logger } from '@nestjs/common';

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  private auth: firebase.auth.Auth;

  constructor(private firebaseApp: FirebaseApp) {
    this.auth = firebaseApp.getAuth();
  }

  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    console.log('PreAuthMiddleware 1', token);
    if (token != null && token != '') {
      console.log('PreAuthMiddleware 2', token);
      this.auth
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          req['user'] = {
            email: decodedToken.email,
            roles: decodedToken.roles || [],
            type: decodedToken.type,
            userId: decodedToken.uid,
          };
          next();
        })
        .catch((err) => {
          Logger.log('PreAuthMiddleware 3', err);
          PreAuthMiddleware.accessDenied(req.url, res);
        });
    } else {
      Logger.log('PreAuthMiddleware 4');
      PreAuthMiddleware.accessDenied(req.url, res);
    }
  }

  private static accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'access denied',
    });
  }
}
