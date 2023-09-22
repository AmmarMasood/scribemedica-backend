"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const firebase_app_1 = require("./auth/firebase-app");
const preauth_middleware_1 = require("./auth/middleware/preauth.middleware");
const notes_module_1 = require("./notes/notes.module");
const subscription_module_1 = require("./subscription/subscription.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(preauth_middleware_1.PreAuthMiddleware).forRoutes({
            path: '/private/*',
            method: common_1.RequestMethod.ALL,
        });
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.DB_URI),
            auth_module_1.AuthModule,
            notes_module_1.NotesModule,
            subscription_module_1.SubscriptionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, firebase_app_1.FirebaseApp],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map