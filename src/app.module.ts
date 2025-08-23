import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtConfigModule } from './jwt/jwt.config.module';
import { EducationModule } from './education/education.module';
import { SkillModule } from './skill/skill.module';
import { CompanyModule } from './company/company.module';
import { CacheManagerModule } from './cacheManger/cache.manger';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    AuthModule,
    ProjectModule,
    PrismaModule, 
    JwtConfigModule, EducationModule, SkillModule, CompanyModule,
    // Import CacheManagerModule to enable caching
    CacheManagerModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
