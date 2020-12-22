import {
  DataTypes,
  Model,
  ModelAttributes,
  Sequelize,
} from "bgio-postgres/lib/sequelize";

interface PlayerAttributes {
  id: string;
  name: string;
}
export class Player extends Model implements PlayerAttributes {
  public id!: string;

  public name!: string;
}

export const playerAttributes: ModelAttributes<Player, PlayerAttributes> = {
  id: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
};

export function initPlayer(sequelize: Sequelize): void {
  Player.init(playerAttributes, { sequelize });
}
