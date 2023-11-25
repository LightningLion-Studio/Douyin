import { DataSource } from "typeorm";
import { Share } from "./share.entity";

export const dataSource = new DataSource({
  type: "mysql",
  host: "gz-cynosdbmysql-grp-4ywssxjx.sql.tencentcdb.com",
  port: 25018,
  username: "community",
  password: "Gh14789632",
  database: "douyin",
  synchronize: true,
  logging: true,
  entities: [Share],
});
