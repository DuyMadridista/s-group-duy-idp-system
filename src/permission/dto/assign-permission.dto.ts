import { ApiProperty } from '@nestjs/swagger';
export class AssignPermissionDto {
	@ApiProperty()
	roleID: number;
	@ApiProperty()
	permissionID: number[];
}
