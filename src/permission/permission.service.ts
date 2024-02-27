import { RoleService } from './../role/role.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(Permission)
		private readonly permissionRepository: Repository<Permission>,
		private readonly roleService: RoleService,
		private readonly userServices: UsersService,
	) {}
	async create(createPermissionDto: Permission) {
		const permission = this.permissionRepository.create(createPermissionDto);
		return await this.permissionRepository.save(permission);
	}

	async findAll() {
		return await this.permissionRepository.find();
	}

	async findOne(id: number) {
		return await this.permissionRepository.findOne({
			where: { id },
		});
	}

	async update(id: number, updatePermissionDto: Permission) {
		const permission = await this.permissionRepository.findOne({
			where: { id },
		});
		if (!permission) {
			throw new NotFoundException();
		}
		Object.assign(permission, updatePermissionDto);

		return await this.permissionRepository.save(permission);
	}

	async remove(id: number) {
		const permission = await this.permissionRepository.findOne({
			where: { id },
		});
		if (!permission) {
			throw new NotFoundException();
		}
		return await this.permissionRepository.remove(permission);
	}
	async getPermissionByRolesName(roles: string[]) {
		const permissions = [];

		for (const roleName of roles) {
			const role = await this.roleService.findOneBy({
				where: { name: roleName },
				relations: ['permissions'],
			});

			if (role) {
				permissions.push(...role.permissions);
			}
		}

		return permissions.map((permission) => permission.name);
	}
	// async getUserPermissionByID(userID: number) {
	// 	const user = await this.userServices.findOneByID(userID);
	// 	if (!user) {
	// 		throw new NotFoundException('User not found');
	// 	}
	// 	const roles = user.roles;
	// 	const permissions = await this.getPermissionByRolesName(
	// 		roles.map((role) => role.name),
	// 	);
	// 	return permissions;
	// }
	async assignPermission(roleID: number, permissionID: number[]) {
		const role = await this.roleService.findOne(roleID);
		if (!role) {
			throw new NotFoundException();
		}
		const assignPermissions: Permission[] = [];
		for (const permissionId of permissionID) {
			const permission = await this.permissionRepository.findOne({
				where: { id: permissionId },
			});
			if (!permission) {
				throw new NotFoundException();
			}
			assignPermissions.push(permission);
		}
		role.permissions = assignPermissions;
		await this.roleService.updatePermission(role.id, role.permissions);
		return role;
	}
}
