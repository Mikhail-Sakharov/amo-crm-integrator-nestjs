import {Module} from '@nestjs/common';
import {AmoCrmController} from './amo-crm.controller';
import {AmoCrmService} from './amo-crm.service';
import {HttpModule} from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AmoCrmController],
  providers: [AmoCrmService]
})
export class AmoCrmModule {}
