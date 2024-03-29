import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Between, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		@Inject(CACHE_MANAGER) private cacheService: Cache,
	) {}
	async create(createUserDto: CreateUserDto) {
		if (
			await this.userRepository.findOne({
				where: { username: createUserDto.username },
			})
		) {
			throw new NotFoundException('User already exists');
		}
		const user = new User();
		const salt = 10;
		user.username = createUserDto.username;
		user.password = await bcrypt.hash(createUserDto.password || '123456', salt);
		user.fullname = createUserDto.fullname;
		const savedUser = await this.userRepository.create(user);
		const roles: Role[] = [];
		// nếu không có role thì roleid mac định là 2 user
		for (const roleId of createUserDto.role || [2]) {
			const role = await this.roleRepository.findOneBy({ id: roleId });
			if (!role) {
				throw new Error(`Role with id ${roleId} not found`);
			}
			roles.push(role);
		}
		savedUser.roles = roles;
		return this.userRepository.save(savedUser);
	}

	async findAll(
		page: number = 1,
		limit: number = 20,
		search: string = '',
		sort: string = 'ASC',
		fromDate: Date | null = null,
		toDate: Date | null = null,
	): Promise<User[]> {
		const offset = (page - 1) * limit;
		const conditions: any = {
			where: {
				username: Like(`%${search}%`),
			},
			order: {
				username: sort.toUpperCase() as 'ASC' | 'DESC',
			},
			take: limit,
			skip: offset,
		};
		if (fromDate && toDate) {
			conditions.where.updatedAt = Between(fromDate, toDate);
		}
		return await this.userRepository.find(conditions);
	}

	async findOneByUsername(username: string): Promise<User | undefined> {
		return this.userRepository.findOne({
			where: { username: username },
			relations: ['roles'],
		});
	}

	async findOneByID(ID: number): Promise<User | undefined> {
		return this.userRepository.findOneBy({ id: ID });
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const user = await this.userRepository.findOne({
			where: { id },
		});
		if (!user) {
			throw new NotFoundException();
		}
		Object.assign(user, updateUserDto);

		return await this.userRepository.save(user);
	}

	async remove(id: number) {
		const user = await this.userRepository.findOne({
			where: { id },
		});
		if (!user) {
			throw new NotFoundException();
		}
		return await this.userRepository.remove(user);
	}
	async updateRoles(id: number, roles: Role[]): Promise<User> {
		const user = await this.userRepository.findOneOrFail({ where: { id } });
		this.userRepository.merge(user, { roles });
		await this.userRepository.save(user);

		// Lưu danh sách vai trò của người dùng vào Redis
		await this.cacheService.set(
			`user:${user.id}:roles`,
			JSON.stringify(roles.map((role) => role.id)),
		);
		console.log(await this.cacheService.get(`user:${user.id}:roles`));

		return user;
	}
}
