import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 0, // 0 means no expiration
      max: 100, // maximum number of items in cache
      isGlobal: true, // Make cache available globally
    }),
  ],
  exports: [CacheModule], // 👈 export so other modules can use it
})
export class CacheManagerModule {}