import { Role } from 'src/role/entities/role.entity';

export class ReadUserDto {
	id: number;
	username: string;
	fullname: string;
	createdAt: Date;
	updatedAt: Date;
	roles: Role[];
}
