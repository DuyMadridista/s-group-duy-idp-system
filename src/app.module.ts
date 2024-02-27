import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthModule } from './auth/auth.module';
import typeorm from './config/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
	imports: [
		UserModule,
		RoleModule,
		PermissionModule,
		CacheModule.register({
			isGlobal: true,
			store: redisStore,
			host: 'localhost',
			port: 6379,
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [typeorm],
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) =>
				configService.get('typeorm'),
		}),
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
