import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Put,
	UseGuards,
	SetMetadata,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { PermissionGuard } from 'src/auth/guard.ts/permission.guard';

@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post()
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.roleService.create(createRoleDto);
	}

	@Get()
	findAll() {
		return this.roleService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.roleService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
		return this.roleService.update(+id, updateRoleDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.roleService.remove(+id);
	}
	@UseGuards(PermissionGuard)
	@SetMetadata('permissions', ['super_admin permission', 'assign roles'])
	@Put('assignRole')
	assignRole(@Body() assignRoledto: AssignRoleDto) {
		return this.roleService.assignRole(
			assignRoledto.userID,
			assignRoledto.roleID,
		);
	}
}
