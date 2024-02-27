import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	SetMetadata,
	UseGuards,
	Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/globalAuth';
import { PermissionGuard } from 'src/auth/guard.ts/permission.guard';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UsersService) {}
	//@Public()
	@UseGuards(PermissionGuard)
	@SetMetadata('permissions', ['create user'])
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}
	@UseGuards(PermissionGuard)
	@SetMetadata('permissions', ['read user'])
	// @Public()
	@Get()
	findAll(
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query('search') search: string,
		@Query('sort') sort: string,
	) {
		return this.userService.findAll(page, limit, search, sort);
	}
	@UseGuards(PermissionGuard)
	@SetMetadata('permissions', ['read user'])
	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.userService.findOneByID(id);
	}
	@UseGuards(PermissionGuard)
	@SetMetadata('permissions', ['update user'])
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}
	@UseGuards(PermissionGuard)
	@SetMetadata('permissions', ['delete user'])
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}
}
