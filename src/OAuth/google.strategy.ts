import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		super({
			clientID: process.env.GG_CLIENT_ID,
			clientSecret: process.env.GG_SECRETCODE,
			callbackURL: 'http://localhost:3000/auth/google-redirect',
			scope: ['email', 'profile'],
		});
	}
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		const { displayName, emails } = profile;
		console.log(profile);
		const user = {
			username: emails[0].value,
			fullname: displayName,
		};
		done(null, user);
	}
}
