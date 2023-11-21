import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AmoCrmService } from './amo-crm.service';

@Controller('amo-crm')
export class AmoCrmController {
  constructor(private readonly amoCrmService: AmoCrmService) {}

  @Get('contacts')
  @HttpCode(HttpStatus.OK)
  public async getContacts() {
    const result = await this.amoCrmService.getContacts();
    return result;
  }
}
