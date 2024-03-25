import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';

export class SeedingUser1711180981275 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const userRepository = queryRunner.manager.getRepository(User);
		const roleRepository = queryRunner.manager.getRepository(Role);

		const allRoles = await roleRepository.find();

		// Tạo và seed 1000 người dùng
		for (let i = 0; i < 1000; i++) {
			const user = new User();
			user.username = `user${i}`;
			user.password = 'password'; // Giả sử mật khẩu mặc định là 'password'
			user.fullname = `Fullname ${i}`;
			user.createdAt = new Date();
			user.email = `user${i}@example.com`;
			user.age = Math.floor(Math.random() * 80) + 18; // Tuổi ngẫu nhiên từ 18 đến 97

			// Lấy ngẫu nhiên một role từ tất cả các role
			const randomRoleId = Math.floor(Math.random() * 4) + 1; // Tạo số ngẫu nhiên từ 1 đến 4
			const selectedRole = allRoles.find((role) => role.id === randomRoleId);
			user.roles = [selectedRole];

			// Lưu người dùng vào cơ sở dữ liệu
			await userRepository.save(user);
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
