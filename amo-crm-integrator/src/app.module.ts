import {Module} from '@nestjs/common';
import {AmoCrmModule} from './amo-crm/amo-crm.module';
import {ConfigModule} from '@nestjs/config';
import {ENV_FILE_PATH} from './app.constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
      load: []
    }),
    AmoCrmModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
