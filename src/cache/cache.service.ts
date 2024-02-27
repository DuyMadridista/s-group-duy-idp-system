import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class CacheService {
	constructor(
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {}

	async getUserPermissionByID(userID: number): Promise<string[]> {
		// Lấy danh sách vai trò của người dùng từ Redis
		const roles = (await this.cacheManager.get(
			`user:${userID}:roles`,
		)) as string;
		if (!roles) {
			return [];
		}

		// Tạo một mảng để lưu trữ tất cả các quyền
		const permissions: string[] = [];

		// Chuyển đổi danh sách vai trò từ chuỗi JSON sang mảng
		const userRoles = JSON.parse(roles);
		console.log(await this.cacheManager.get(`role:1:permissions`));
		// Lặp qua mỗi vai trò và lấy danh sách quyền từ mỗi vai trò
		for (const role of userRoles) {
			const rolePermissions = (await this.cacheManager.get(
				`role:${role}:permissions`,
			)) as string;
			console.log(await this.cacheManager.get(`role:${role}:permissions`));
			console.log('duy');

			if (rolePermissions) {
				// Chuyển đổi danh sách quyền từ chuỗi JSON sang mảng
				const permissionsFromRole = JSON.parse(rolePermissions);
				permissions.push(...permissionsFromRole);
			}
		}
		return permissions;
	}
}
