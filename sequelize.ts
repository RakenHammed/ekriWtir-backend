import { Sequelize, SequelizeOptions } from "sequelize-typescript";

const sequelizeParams: SequelizeOptions = {
  dialect: "mysql",
  database: "ekriWtir",
  username: "root",
  password: "",
  modelPaths: [__dirname + "/models/*.js"],
  logging: (msg: any) => console.log(msg),
  define: {
    freezeTableName: true, // prevent sequelize from pluralizing table names
  },
};

export const sequelize = new Sequelize(sequelizeParams);
