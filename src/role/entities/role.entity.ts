import { Permission } from 'src/permission/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';
//import { User } from 'src/user/entities/user.entity';
import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';

@Entity({ name: 'roles' })
export class Role {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ type: 'text', unique: true })
	name: string;
	@Column({ type: 'text' })
	description: string;
	@Column({ type: 'boolean', default: 'true' })
	isEditable: boolean;
	@Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;
	@Column({ type: 'timestamptz', nullable: true, default: null })
	updatedAt: Date;

	@ManyToMany(() => Permission, (permission) => permission.roles)
	@JoinTable({
		name: 'roles_permissions',
		joinColumn: {
			name: 'rolesId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'permissionId',
			referencedColumnName: 'id',
		},
	})
	permissions?: Permission[];

	@ManyToMany(() => User, (user) => user.roles)
	@JoinTable({
		name: 'users_roles',
		joinColumn: {
			name: 'roleId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'usersId',
			referencedColumnName: 'id',
		},
	})
	users?: User[];
}
