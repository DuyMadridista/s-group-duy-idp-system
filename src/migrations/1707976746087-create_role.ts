import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRole1707976746087 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "isEditable" boolean NOT NULL DEFAULT true, "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" timestamptz DEFAULT null, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "roles_permissions" ("rolesId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_f5a7cd59be926fd893fbf7f36cc" PRIMARY KEY ("rolesId", "permissionId"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_11df1ca3c731b1b7aeb7d61626" ON "roles_permissions" ("rolesId") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_157197c72d8d61230b392c00a7" ON "roles_permissions" ("permissionId") `,
		);
		await queryRunner.query(
			`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_11df1ca3c731b1b7aeb7d616264" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "roles_permissions" ADD CONSTRAINT "FK_157197c72d8d61230b392c00a7e" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_157197c72d8d61230b392c00a7e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "roles_permissions" DROP CONSTRAINT "FK_11df1ca3c731b1b7aeb7d616264"`,
		);
		await queryRunner.query(`DROP INDEX "IDX_157197c72d8d61230b392c00a7"`);
		await queryRunner.query(`DROP INDEX "IDX_11df1ca3c731b1b7aeb7d61626"`);
		await queryRunner.query(`DROP TABLE "roles_permissions"`);
		await queryRunner.query(`DROP TABLE "roles"`);
	}
}
