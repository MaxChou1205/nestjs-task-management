import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const options = new DocumentBuilder()
    .setTitle('TPYD API')
    .setDescription('測試部分api接口需要登入')
    .setVersion('1.0')
    .addCookieAuth()
    .addServer('/')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`/swagger`, app, document);

  await app.listen(process.env.PORT);
}

bootstrap();
