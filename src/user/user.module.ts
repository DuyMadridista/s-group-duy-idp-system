import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { CacheService } from 'src/cache/cache.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, Role])],
	controllers: [UserController],
	providers: [UsersService, CacheService],
	exports: [UsersService],
})
export class UserModule {}
