/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { WsAdapter } from '@nestjs/platform-ws';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: false }));

  const options = new DocumentBuilder()
  .setTitle('Blood Donation API')
  .setDescription('API for managing blood donation')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(
    session({
      secret: 'nguyentanhung2402',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30000 },
    }),
  );

  // Sử dụng WsAdapter để kích hoạt WebSocket
  // app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(8000);
  console.log('Application is running on: http://localhost:8000');
}
bootstrap();
