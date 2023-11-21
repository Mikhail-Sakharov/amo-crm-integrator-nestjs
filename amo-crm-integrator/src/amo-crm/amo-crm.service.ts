import {HttpService} from '@nestjs/axios';
import {Injectable, Logger} from '@nestjs/common';
import {AxiosError} from 'axios';
import {catchError, firstValueFrom} from 'rxjs';

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

@Injectable()
export class AmoCrmService {
  constructor(private readonly httpService: HttpService) {}

  public async getTokens(dto: GetTokens) {
    const {data} = await firstValueFrom(
      this.httpService.post(
        'https://sakharovmikhail.amocrm.ru/oauth2/access_token',
        dto,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).pipe(
        catchError((error: AxiosError) => {
          Logger.error(error.response.data);
          throw 'Something went wrong!';
        }),
      ),
    );
    return data;
  }

  async checkContact(dto: CheckContact, token: string) {
    const contactByEmail = await this.getContacts(token, dto.email);
    const contactByPhone = await this.getContacts(token, dto.phone);

    if (contactByEmail || contactByPhone) {
      const contactEmailId = contactByEmail._embedded.contacts[0].id ?? '';
      const contactPhoneId = contactByPhone._embedded.contacts[0].id ?? '';
      const id = contactEmailId ?? contactPhoneId;
      await this.updateContact([
        {
          id,
          name: dto.name,
          custom_fields_values: [
            {
              field_id: 1451445,
              values: [
                {
                  value: dto.email
                }
              ]
            },
            {
              field_id: 1451443,
              values: [
                {
                  value: dto.phone
                }
              ]
            }
          ]
        }
      ], token)

      const newLead = await this.createLead([
        {
          name: "Новая сделка",
          _embedded:{
            contacts:[
              {
                id
              }
            ]
          }
        }
      ], token);
  
      return newLead;
    }

    const newLead = await this.createLead([
      {
        name: "Новая сделка",
        _embedded:{
          contacts:[
            {
              name: dto.name,
              custom_fields_values: [
                {
                  field_id: 1451445,
                  values: [
                    {
                      value: dto.email
                    }
                  ]
                },
                {
                  field_id: 1451443,
                  values: [
                    {
                      value: dto.phone
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ], token);

    return newLead;
  }

  async getContacts(token: string, searchString?: string) {
    const query = searchString ? `?query=${searchString}` : '';
    const {data} = await firstValueFrom(
      this.httpService.get(
        `https://sakharovmikhail.amocrm.ru/api/v4/contacts${query}`,
        {
          headers: {
            Authorization: `${token}`
          }
        }
        ).pipe(
        catchError((error: AxiosError) => {
          Logger.error(error.response.data);
          throw 'Something went wrong!';
        }),
      ),
    );
    return data;
  }

  public async createContact(dto: any, token: string) {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://sakharovmikhail.amocrm.ru/api/v4/contacts',
        dto,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          }
        }
      ).pipe(
        catchError((error: AxiosError) => {
          Logger.error(error.response.data);
          throw 'Something went wrong!';
        }),
      ),
    );
    return response.data;
  }

  public async updateContact(dto: any, token: string) {
    const response = await firstValueFrom(
      this.httpService.patch(
        'https://sakharovmikhail.amocrm.ru/api/v4/contacts',
        dto,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          }
        }
      ).pipe(
        catchError((error: AxiosError) => {
          Logger.error(error.response.data);
          throw 'Something went wrong!';
        }),
      ),
    );
    return response.data;
  }

  public async createLead(dto: any, token: string) {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://sakharovmikhail.amocrm.ru/api/v4/leads/complex',
        dto,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          }
        }
      ).pipe(
        catchError((error: AxiosError) => {
          Logger.error(error.response.data);
          throw 'Something went wrong!';
        }),
      ),
    );
    return response.data;
  }
}
