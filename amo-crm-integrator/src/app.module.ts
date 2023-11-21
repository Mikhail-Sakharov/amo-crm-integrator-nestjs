import { Module } from '@nestjs/common';
import { AmoCrmModule } from './amo-crm/amo-crm.module';

@Module({
  imports: [AmoCrmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
