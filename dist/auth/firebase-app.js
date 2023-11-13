"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseApp = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const firebase = require("firebase-admin");
let FirebaseApp = class FirebaseApp {
    constructor(configService) {
        this.configService = configService;
        this.getAuth = () => {
            return this.firebaseApp.auth();
        };
        this.firestore = () => {
            return this.firebaseApp.firestore();
        };
        this.firebaseConfig = {
            clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
            projectId: this.configService.get('FIREBASE_PROJECT_ID'),
            privateKey: this.configService.get('FIREBASE_PRIVATE_KEY')
                ? this.configService
                    .get('FIREBASE_PRIVATE_KEY')
                    .replace(/\\n/g, '\n')
                : undefined,
        };
        this.firebaseApp = firebase.initializeApp({
            credential: firebase.credential.cert(Object.assign({}, this.firebaseConfig)),
        });
    }
};
FirebaseApp = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseApp);
exports.FirebaseApp = FirebaseApp;
//# sourceMappingURL=firebase-app.js.map