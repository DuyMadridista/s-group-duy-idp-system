import { GoogleStrategy } from './google.strategy';
import { Module } from '@nestjs/common';
import { GoogleService } from './google-auth.service';
import { GoogleController } from './google-auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [UserModule],
	controllers: [GoogleController],
	providers: [GoogleService, GoogleStrategy],
})
export class GoogleModule {}
