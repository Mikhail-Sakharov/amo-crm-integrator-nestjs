import {Body, Controller, Get, HttpCode, HttpStatus, Post, Query, RawBodyRequest, Req} from '@nestjs/common';
import {AmoCrmService} from './amo-crm.service';

interface GetTokens {
  client_id: string;
  client_secret: string;
  grant_type: string;
  code: string;
  redirect_uri: string;
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
}
