import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class GoogleService {
	constructor(
		private readonly userService: UsersService,
		private jwtService: JwtService,
	) {}

	async googleLogin(req) {
		if (!req.user) {
			return { message: 'No user from google' };
		}

		const existingUser = await this.userService.findOneByUsername(
			req.user.username,
		);

		if (!existingUser) {
			const newUser = await this.userService.create(req.user);
			const token = await this.jwtService.signAsync({ id: newUser.id });
			return { accessToken: token };
		}

		const token = await this.jwtService.signAsync({ id: existingUser.id });
		return { accessToken: token };
	}
}
