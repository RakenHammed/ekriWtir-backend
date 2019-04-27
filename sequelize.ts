import { Sequelize } from "sequelize-typescript";

const sequelizeParams = {
  dialect: "mysql",
  database: "ekriWtir",
  username: "root",
  password: "",
  modelPaths: [__dirname + "/models/*.js"],
};

export const sequelize = new Sequelize(sequelizeParams);