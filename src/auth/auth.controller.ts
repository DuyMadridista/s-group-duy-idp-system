import {
	Body,
	Controller,
	Post,
	Get,
	HttpCode,
	HttpStatus,
	Request,
	UseGuards,
	SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { loginDTO } from './dto/loginDTO';
import { Public } from './globalAuth';
import { PermissionGuard } from './guard.ts/permission.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(@Body() loginDTO: loginDTO) {
		return this.authService.login(loginDTO.username, loginDTO.password);
	}

	@UseGuards(PermissionGuard)
	@SetMetadata('permissions', ['read user'])
	@Get('profile')
	getProfile() {
		return 'okk';
	}
}
