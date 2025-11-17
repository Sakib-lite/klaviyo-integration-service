import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateEventsTable1763373976093 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "events",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "event_name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "event_attributes",
                        type: "json",
                        isNullable: false,
                    },
                    {
                        name: "profile_attributes",
                        type: "json",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        default: 1,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            "events",
            new TableIndex({
                name: "IDX_EVENT_NAME",
                columnNames: ["event_name"],
            }),
        );

        await queryRunner.createIndex(
            "events",
            new TableIndex({
                name: "IDX_CREATED_AT",
                columnNames: ["created_at"],
            }),
        );

        await queryRunner.createIndex(
            "events",
            new TableIndex({
                name: "IDX_STATUS",
                columnNames: ["status"],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("events", "IDX_STATUS");
        await queryRunner.dropIndex("events", "IDX_CREATED_AT");
        await queryRunner.dropIndex("events", "IDX_EVENT_NAME");
        await queryRunner.dropTable("events");
    }

}
