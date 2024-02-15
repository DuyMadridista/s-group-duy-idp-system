import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
	constructor(
		@InjectRepository(Permission)
		private readonly userRepository: Repository<Permission>,
	) {}
	async create(createPermissionDto: Permission) {
		const permission = this.userRepository.create(createPermissionDto);
		return await this.userRepository.save(permission);
	}

	async findAll() {
		return await this.userRepository.find();
	}

	async findOne(id: number) {
		return await this.userRepository.findOne({
			where: { id },
		});
	}

	async update(id: number, updatePermissionDto: Permission) {
		const permission = await this.userRepository.findOne({
			where: { id },
		});
		if (!permission) {
			throw new NotFoundException();
		}
		Object.assign(permission, updatePermissionDto);

		return await this.userRepository.save(permission);
	}

	async remove(id: number) {
		const permission = await this.userRepository.findOne({
			where: { id },
		});
		if (!permission) {
			throw new NotFoundException();
		}
		return await this.userRepository.remove(permission);
	}
}
