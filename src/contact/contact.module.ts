import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Global banane ke liye
    }),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
