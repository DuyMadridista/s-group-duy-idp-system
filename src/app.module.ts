import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import * as cors from 'cors';
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
import { GoogleModule } from './OAuth/google-auth.module';
import { UsersService } from './user/user.service';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';

@Module({
	imports: [
		UserModule,
		RoleModule,
		GoogleModule,
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
		TypeOrmModule.forFeature([User, Role, Permission]),
	],
	controllers: [AppController],
	providers: [AppService, UsersService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(cors({ origin: '*' }))
			.forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}
