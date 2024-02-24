import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
@Module({
	imports: [
		UserModule,
		TypeOrmModule.forFeature([Role]),
		TypeOrmModule.forFeature([User]),
	],
	controllers: [RoleController],
	providers: [RoleService, UsersService],
	exports: [RoleService],
})
export class RoleModule {}
