import { PermissionModule } from './../permission/permission.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth.constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard.ts/auth.guard';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/role/entities/role.entity';
import { RoleModule } from 'src/role/role.module';
import { CacheService } from 'src/cache/cache.service';

@Module({
	imports: [
		UserModule,
		TypeOrmModule.forFeature([Permission, Role]),
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '60h' },
		}),
		PermissionModule,
		RoleModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		PermissionService,
		RoleService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		CacheService,
	],
	exports: [AuthService],
})
export class AuthModule {}
//redis
