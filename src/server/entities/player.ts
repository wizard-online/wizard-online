import { DataTypes, Model, ModelAttributes } from "bgio-postgres/lib/sequelize";

export class Player extends Model {
  public id!: string;

  public name!: string;
}

export const playerAttributes: ModelAttributes = {
  id: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
};
