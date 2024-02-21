import { Role } from 'src/role/entities/role.entity';
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ type: 'text', unique: true })
	name: string;
	@Column({ type: 'text' })
	description: string;
	@Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;
	@Column({ type: 'timestamptz', nullable: true, default: null })
	updatedAt: Date;
	@ManyToMany(() => Role, (role) => role.permissions)
	@JoinTable({
		name: 'roles_permissions',
		joinColumn: {
			name: 'permissionId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'rolesId',
			referencedColumnName: 'id',
		},
	})
	roles?: Role[];
}
