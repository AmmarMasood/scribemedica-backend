import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import rawBodyMiddleware from './middlewares/rawBody.middleware';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // replace with your client app URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  console.log('something....app');
  app.use(rawBodyMiddleware());
  await app.init();
  console.log('something....app 2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties from DTOs
    }),
  );
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
