import {Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, RawBodyRequest, Req} from '@nestjs/common';
import {AmoCrmService} from './amo-crm.service';

interface GetTokens {
  client_id: string;
  client_secret: string;
  grant_type: string;
  code: string;
  redirect_uri: string;
}

interface CheckContact {
  name: string;
  email: string;
  phone: string;
}

@Controller('amo-crm')
export class AmoCrmController {
  constructor(private readonly amoCrmService: AmoCrmService) {}

  @Post('tokens')
  @HttpCode(HttpStatus.OK)
  public async getTokens(
    @Body() dto: GetTokens
  ) {
    const result = await this.amoCrmService.getTokens(dto);
    return result;
  }

  @Get('contacts')
  @HttpCode(HttpStatus.OK)
  public async getContacts(
    @Req() req: RawBodyRequest<{headers: {authorization: string}}>,
    @Query() queryString?: {query: string}
  ) {
    const token = req.headers.authorization;
    const searchString = queryString.query;
    const result = await this.amoCrmService.getContacts(token, searchString);
    return result;
  }

  @Post('contacts')
  @HttpCode(HttpStatus.OK)
  public async createContact(
    @Req() req: RawBodyRequest<{headers: {authorization: string}}>,
    @Body() dto: any
  ) {
    const token = req.headers.authorization;
    const result = await this.amoCrmService.createContact(dto, token);
    return result;
  }

  @Patch('contacts')
  @HttpCode(HttpStatus.OK)
  public async updateContact(
    @Req() req: RawBodyRequest<{headers: {authorization: string}}>,
    @Body() dto: any
  ) {
    const token = req.headers.authorization;
    const result = await this.amoCrmService.updateContact(dto, token);
    return result;
  }

  // Ресурс для проверки существования контакта в БД,
  // создания новой записи в случае отсутствия
  // и добавления новой сделки в первом статусе воронки

  @Post('contacts/check')
  @HttpCode(HttpStatus.OK)
  public async checkContact(
    @Req() req: RawBodyRequest<{headers: {authorization: string}}>,
    @Body() dto: CheckContact
  ) {
    const token = req.headers.authorization;
    const result = await this.amoCrmService.checkContact(dto, token);
    return result;
  }

  @Post('leads')
  @HttpCode(HttpStatus.OK)
  public async createLead(
    @Req() req: RawBodyRequest<{headers: {authorization: string}}>,
    @Body() dto: any
  ) {
    const token = req.headers.authorization;
    const result = await this.amoCrmService.createLead(dto, token);
    return result;
  }
}
