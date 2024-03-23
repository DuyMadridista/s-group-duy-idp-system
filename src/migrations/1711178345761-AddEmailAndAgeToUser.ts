import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailAndAgeToUser1711178345761 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ADD "email" character varying NOT NULL`,
		);
		await queryRunner.query(`ALTER TABLE "users" ADD "age" integer NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
	}
}
