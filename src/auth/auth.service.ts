import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PermissionService } from 'src/permission/permission.service';
@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private readonly permissionsService: PermissionService,
	) {}

	async login(username: string, password: string) {
		const user = await this.usersService.findOneByUsername(username);
		const passwordValid = await bcrypt.compare(password, user.password);
		if (!passwordValid) {
			throw new UnauthorizedException();
		}
		console.log(user.roles);
		const userPermissions =
			await this.permissionsService.getPermissionByRolesName(
				user.roles.map((role) => role.name),
			);
		const payload = {
			id: user.id,
			username: user.username,
			permissions: userPermissions,
		};
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
