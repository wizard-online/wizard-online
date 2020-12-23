import {
  DataTypes,
  Model,
  ModelAttributes,
  Sequelize,
} from "bgio-postgres/lib/sequelize";

export class ScoreCell extends Model {
  public matchId!: string;

  public round!: number;

  public playerId!: string;

  public bid!: number;

  public tricks!: number;

  public score!: number;

  public total!: number;

  public winner?: boolean;

  public negative?: boolean;
}

export const scoreCellAttributes: ModelAttributes = {
  matchId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  round: {
    type: DataTypes.SMALLINT.UNSIGNED,
    primaryKey: true,
  },
  playerId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  bid: {
    type: DataTypes.SMALLINT.UNSIGNED,
  },
  tricks: {
    type: DataTypes.SMALLINT.UNSIGNED,
  },
  score: {
    type: DataTypes.INTEGER,
  },
  total: {
    type: DataTypes.INTEGER,
  },
  winner: {
    type: DataTypes.BOOLEAN,
  },
  negative: {
    type: DataTypes.BOOLEAN,
  },
};

export function initScoreCell(sequelize: Sequelize): void {
  ScoreCell.init(scoreCellAttributes, { sequelize });
}
