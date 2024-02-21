import { Role } from 'src/role/entities/role.entity';
import {
	Column,
	Entity,
	ManyToMany,
	JoinTable,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ unique: true })
	username: string;
	@Column({ type: 'text' })
	password: string;
	@Column({ type: 'text' })
	fullname: string;
	@Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;
	@Column({ type: 'timestamptz', nullable: true, default: null })
	updatedAt: Date;

	@ManyToMany(() => Role)
	@JoinTable({
		name: 'users_roles',
		joinColumn: {
			name: 'usersId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'roleId',
			referencedColumnName: 'id',
		},
	})
	roles?: Role[];
}
