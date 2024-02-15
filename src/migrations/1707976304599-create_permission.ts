import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermission1707976304599 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" timestamptz DEFAULT null, CONSTRAINT "PK_6c1852514b7b52a3b9003b4f601" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "permissions"`);
	}
}
