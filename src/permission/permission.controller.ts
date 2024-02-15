import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';

@Controller('permission')
export class PermissionController {
	constructor(private readonly permissionService: PermissionService) {}

	@Post()
	create(@Body() createPermissionDto: Permission) {
		return this.permissionService.create(createPermissionDto);
	}

	@Get()
	findAll() {
		return this.permissionService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.permissionService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePermissionDto: Permission) {
		return this.permissionService.update(+id, updatePermissionDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.permissionService.remove(+id);
	}
}
