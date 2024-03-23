import { Public } from 'src/auth/globalAuth';
import { GoogleService } from './google-auth.service';
import { GoogleOAuthGuard } from './googleAuth';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

@Controller('auth')
export class GoogleController {
	constructor(private readonly googleService: GoogleService) {}
	@Public()
	@Get()
	@UseGuards(GoogleOAuthGuard)
	async googleAuth() {}

	@Public()
	@Get('google-redirect')
	@UseGuards(GoogleOAuthGuard)
	googleAuthRedirect(@Request() req) {
		return this.googleService.googleLogin(req);
	}
}
