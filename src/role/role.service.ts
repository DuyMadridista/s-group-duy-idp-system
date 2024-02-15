import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
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
}
