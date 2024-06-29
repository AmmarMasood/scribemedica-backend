import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FirebaseApp } from './auth/firebase-app';
import { PreAuthMiddleware } from './auth/middleware/preauth.middleware';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { NotesModule } from './notes/notes.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    NotesModule,
    SubscriptionModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseApp],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestLoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
    consumer.apply(PreAuthMiddleware).forRoutes({
      path: '/private/*',
      method: RequestMethod.ALL,
    });
  }
}
