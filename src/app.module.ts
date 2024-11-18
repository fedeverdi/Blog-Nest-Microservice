import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './models/blog.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGO_INITDB_ROOT_USERNAME')}:${configService.get(
          'MONGO_INITDB_ROOT_PASSWORD',
        )}@${configService.get('MONGO_HOST')}:${configService.get(
          'MONGO_PORT',
        )}/${configService.get('MONGO_DB')}?authSource=admin`,
      }),
    }),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
