import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import rawBodyMiddleware from './middlewares/rawBody.middleware';
require('dotenv').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get('ConfigService');
  const port = configService.get('PORT');
  app.enableCors();
  app.use(rawBodyMiddleware());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties from DTOs
    }),
  );
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
