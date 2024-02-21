import { ApiProperty } from '@nestjs/swagger';
export class AssignRoleDto {
	@ApiProperty()
	userID: number;
	@ApiProperty()
	roleID: number[];
}
