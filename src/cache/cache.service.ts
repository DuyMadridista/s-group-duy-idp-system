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
		const roles = (await this.cacheManager.get(
			`user:${userID}:roles`,
		)) as string;
		if (!roles) {
			return [];
		}
		const permissions: string[] = [];
		const userRoles = JSON.parse(roles);
		console.log(await this.cacheManager.get(`role:1:permissions`));
		for (const role of userRoles) {
			const rolePermissions = (await this.cacheManager.get(
				`role:${role}:permissions`,
			)) as string;
			console.log(await this.cacheManager.get(`role:${role}:permissions`));
			console.log('duy');

			if (rolePermissions) {
				const permissionsFromRole = JSON.parse(rolePermissions);
				permissions.push(...permissionsFromRole);
			}
		}
		return permissions;
	}
}
