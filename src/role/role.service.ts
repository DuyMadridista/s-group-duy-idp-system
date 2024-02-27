import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/user/user.service';
import { Permission } from 'src/permission/entities/permission.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		private readonly userServices: UsersService,
		@Inject(CACHE_MANAGER) private cacheService: Cache,
	) {}
	async create(createRoleDto: CreateRoleDto) {
		const role = this.roleRepository.create(createRoleDto);
		return await this.roleRepository.save(role);
	}

	async findAll() {
		return await this.roleRepository.find();
	}

	async findOne(id: number) {
		return await this.roleRepository.findOne({
			where: { id },
		});
	}
	async findOneBy(query: any) {
		try {
			const role = await this.roleRepository.findOne(query);
			if (!role) {
				throw new NotFoundException('Role not found');
			}
			return role;
		} catch (error) {
			throw new NotFoundException('Role not found');
		}
	}

	async update(id: number, updateRoleDto: UpdateRoleDto) {
		const role = await this.roleRepository.findOne({
			where: { id },
		});
		if (!role) {
			throw new NotFoundException();
		}
		Object.assign(role, updateRoleDto);

		return await this.roleRepository.save(role);
	}

	async remove(id: number) {
		const role = await this.roleRepository.findOne({
			where: { id },
		});
		if (!role) {
			throw new NotFoundException();
		}
		return await this.roleRepository.remove(role);
	}
	async assignRole(userID: number, roleID: number[]) {
		const user = await this.userServices.findOneByID(userID);
		if (!user) {
			throw new NotFoundException();
		}
		const assignRoles: Role[] = [];
		roleID.forEach(async (id) => {
			const roles = await this.roleRepository.findOneBy({ id: id });
			if (!roles) {
				throw new NotFoundException();
			}
			assignRoles.push(roles);
		});
		user.roles = assignRoles;
		await this.userServices.updateRoles(user.id, user.roles);
		return user;
	}
	async updatePermission(
		id: number,
		permissions: Permission[],
	): Promise<Permission> {
		const role = await this.roleRepository.findOneOrFail({ where: { id } });
		this.roleRepository.merge(role, { permissions });
		await this.roleRepository.save(role);
		console.log(await this.cacheService.get(`role:${role.id}:permissions`));
		//update redis
		await this.cacheService.set(
			`role:${role.id}:permissions`,
			JSON.stringify(permissions.map((permission) => permission.name)),
		);
		console.log(await this.cacheService.get(`role:${role.id}:permissions`));

		return role;
	}
}
