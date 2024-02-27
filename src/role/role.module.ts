import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { CacheService } from 'src/cache/cache.service';
@Module({
	imports: [
		UserModule,
		TypeOrmModule.forFeature([Role]),
		TypeOrmModule.forFeature([User]),
	],
	controllers: [RoleController],
	providers: [RoleService, UsersService, CacheService],
	exports: [RoleService],
})
export class RoleModule {}
