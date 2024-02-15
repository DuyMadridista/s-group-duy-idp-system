import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1707976885941 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "fullname" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT null, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "users_roles" ("usersId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_1a2bd35f3bd9ea08c6077cd4f13" PRIMARY KEY ("usersId", "roleId"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_6a7b29549d713dd44d3aaab898" ON "users_roles" ("usersId") `,
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_2bb69833a62d12b8ee0c231cbb" ON "users_roles" ("roleId") `,
		);
		await queryRunner.query(
			`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_6a7b29549d713dd44d3aaab8981" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_2bb69833a62d12b8ee0c231cbbc" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_2bb69833a62d12b8ee0c231cbbc"`,
		);
		await queryRunner.query(
			`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_6a7b29549d713dd44d3aaab8981"`,
		);
		await queryRunner.query(`DROP INDEX "IDX_2bb69833a62d12b8ee0c231cbb"`);
		await queryRunner.query(`DROP INDEX "IDX_6a7b29549d713dd44d3aaab898"`);
		await queryRunner.query(`DROP TABLE "users_roles"`);
		await queryRunner.query(`DROP TABLE "users"`);
	}
}
