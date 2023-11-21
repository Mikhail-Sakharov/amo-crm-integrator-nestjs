import { Injectable } from '@nestjs/common';

@Injectable()
export class AmoCrmService {
  public async getContacts() {
    return 'Hello from AmoCrmService!';
  }
}
