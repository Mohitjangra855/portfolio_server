  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
  import { DocumentBuilder } from '@nestjs/swagger';
  import cookieParser from 'cookie-parser';
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Set up Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Portfolio API')
      .setDescription('Portfolio API documentation of projects and skills')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Enable CORS for the frontend application

    app.enableCors({
      origin: 'http://localhost:8080',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders:  ['Content-Type', 'Accept', 'Authorization'],
    });
    // app.setGlobalPrefix('api');
    //set cookie parser
  app.use(cookieParser());
    await app.listen(process.env.PORT ?? 3000);
  }
  bootstrap();
