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

@Injectable()
export class AmoCrmService {
  constructor(private readonly httpService: HttpService) {}

  public async getTokens(dto: GetTokens) {
    const {data} = await firstValueFrom(
      this.httpService.post('https://sakharovmikhail.amocrm.ru/oauth2/access_token', {
        headers: {
          'Content-Type': 'application/json'
        },
        data: dto
      }).pipe(
        catchError((error: AxiosError) => {
          Logger.error(error.response.data);
          throw 'Something went wrong!';
        }),
      ),
    );
    return data;
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
}
