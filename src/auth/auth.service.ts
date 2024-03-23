import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async login(username: string, password: string) {
		const user = await this.usersService.findOneByUsername(username);
		const passwordValid = await bcrypt.compare(password, user.password);
		if (!passwordValid) {
			throw new UnauthorizedException();
		}
		const payload = {
			id: user.id,
		};
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
	async getProfile(req: any) {
		const token = req.headers.authorization.replace('Bearer ', '');

		// Giải mã token để lấy user ID
		const decodedToken = this.jwtService.decode(token);
		const userId = decodedToken['id'];

		// Tìm kiếm thông tin user từ user ID
		const user = await this.usersService.findOneByID(userId);

		// Trả về thông tin profile của user
		return {
			id: user.id,
			username: user.username,
			age: user.age,
			email: user.email,
			fullname: user.fullname,
			createAt: user.createdAt,
			updateAt: user.updatedAt,
			userRoles: user.roles.map((role) => role.name),
			// Thêm các thông tin profile khác nếu cần
		};
	}
	// private extractTokenFromHeader(request: Request): string | undefined {
	// 	const [type, token] = request.headers.authorization?.split(' ') ?? [];
	// 	return type === 'Bearer' ? token : undefined;
	// }
}
