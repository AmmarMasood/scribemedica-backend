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
const firebase = require("firebase-admin");
let FirebaseApp = class FirebaseApp {
    constructor() {
        this.getAuth = () => {
            return this.firebaseApp.auth();
        };
        this.firestore = () => {
            return this.firebaseApp.firestore();
        };
        const firebaseKey = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQxYiphUht83NE\nlSuGmC38ZSpa0xhXkkEy1M5XuHiKcCK2JYB9LVHl84A9n/Nh3WQYFi4FvAzz3N5O\n6U0SfU5+dZOqDQMleuZBUptmdWTWdBXMxxdjKbzXU5L9j8B95EzXP9y8N7DjAVDh\nQBI7oNZ/0mZqdr4UQTtj1ygNC9FaukDuliFImhzr7wSmCa1EItfW1Bjnl+4HcmRU\nobGHARtupIEL+Ckl/z/Mn2U8pr16OGMZ4laS12ekYxGVYgj7fnYQq+MlH7+V/Onc\nDosMCpP864QW2jmhH4ACntgrS2f8mGaQxMf2ACRvxHV/A1BwPxHGAibRcSMlUs0c\nl+Lng6WxAgMBAAECggEAAPgDsvawf/se3DD9hVfAMeFFzatYW/KsrQfWB8vuOkU8\nMgBxTNNoo4KqZA7RljEM8Xwr3UCyxjBukyrrvcPZWQaiZ2n9S1+bQS8ZE8QEcmbS\nQZOkcQQ88Tpc7qKLxAHK1f5gv7pZ7qm/RnZRx1dPG4N+UGzp46XsWMGjONFG2M8N\njwWzGIosCc779h6CmmR/SNB3yQUiUJ3ERb4D79AoB4JqvmTFwcW2YuXQX6wluHYa\nd4K0q9j2RCAbfAPSMrQgrnrXmW7E1GQ1N3hT7ZqWxh4jQBBssdjV0u1x68fzr32d\nZ1ODix9nFlq8+WDMtQH+VRr/RWKdYjDzRCgkhySaiQKBgQD1xDJz8mw6q7U/7moQ\n+h8g2vpWlouPTD4UAy+Ei5M/H+7DrRGX9V5sVSGYkA9c2klr0XqT8weKh+OubAYf\nAqbWmPhzjOo3Mr4qdMlw6krCY80JYVytKcj/asxmFyuEJIOHv89vBsGB2rSC4qrI\nptigGYB6SsWoV6XEG5CV7f/D+QKBgQDZdvuD45RoUUCXR8x1H7ylx/mpfq0uA6HW\nC4xUeo/Ezx+WmUi3PelmQtFuaJn+JxQrRVBahFe2URvcsVyTkNI/hZHoyXUuLzwh\nol20OzK3b1DitOwgmPuoq8xCihPsT1vFt+FcL8owunT/dHKNoXVPLwR2BBU1u2b+\nmjM7emdteQKBgQDn7rgOZAFvfQwXwU+npeQqhX0qqfgay8Dp8feuBmp3cBNL5tBr\nr8vkQJLr/0gAQKB5d79OUFQVkBh2SsucCEyayNHvelSustx0BLL2NKVIvhaJe7CS\nWpStNoSe887FbhAS1BlWlfGYMmWX/4Fcytg0ftyYjGfsboqpf7n7RBfTQQKBgAoD\nqq12K31qUHkm+0lhfsR7owmlJcB6tlcvDPVO95PundvHj0uw9DCbXx2gf4buscUU\nWhDxC0EAFzJgkIzTHHuEYSXBMT5BOpmp6nrERx+fZrAp+L2/jcdEshFWXniBZw6B\n20Tthngb/gtNh4DyMH7HAYOVyIxC5wlOfJF+n4ixAoGAOtD7mlYRXdxy4ovE+V5z\nmomxXpz3c/AwgEeCFoRp3fM39zGAgS8/DgpmGINntwTXDct+K24fQ/is8uJcw44h\nBQC+g1R2KgFIVi33RawHEe4zSNS1g84VQ7LRaFo+hL2vf0vLJDcDIpoo1wa2ZZUF\nwLnuZNpCBoU2d/1ptDN9YrQ=\n-----END PRIVATE KEY-----\n`;
        console.log('firebaseKey', firebaseKey);
        this.firebaseConfig = {
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: firebaseKey,
        };
        this.firebaseApp = firebase.initializeApp({
            credential: firebase.credential.cert(Object.assign({}, this.firebaseConfig)),
        });
    }
};
FirebaseApp = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FirebaseApp);
exports.FirebaseApp = FirebaseApp;
//# sourceMappingURL=firebase-app.js.map