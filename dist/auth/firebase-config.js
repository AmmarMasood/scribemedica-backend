'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const firebaseConfig = {
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,
};
exports.default = firebaseConfig;
//# sourceMappingURL=firebase-config.js.map
