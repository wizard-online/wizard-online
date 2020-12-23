import { LogEntry, Server, State } from "boardgame.io";
import { Async } from "boardgame.io/internal";
import {
  CreateGameOpts,
  CreateMatchOpts,
  FetchOpts,
  FetchResult,
  ListGamesOpts,
  ListMatchesOpts,
} from "boardgame.io/dist/types/src/server/db/base";
import { PostgresStore } from "bgio-postgres";
import { Match } from "bgio-postgres/lib/entities";
import { initPlayer, Player } from "./entities/player";
import { WizardState } from "../shared/WizardState";
import { getLeaders } from "../shared/entities/score.utils";
import { PlayerID } from "../shared/entities/players";
import {
  initMatchPlayerRound,
  MatchPlayerRound,
} from "./entities/match-player-round";

export class ServerPostgres extends Async {
  constructor(private postgres: PostgresStore) {
    super();
    initPlayer(postgres.sequelize);
    initMatchPlayerRound(postgres.sequelize);

    MatchPlayerRound.belongsTo(Player, {
      foreignKey: "playerId",
    });
    Player.hasMany(MatchPlayerRound, {
      foreignKey: "playerId",
    });

    MatchPlayerRound.belongsTo(Match, {
      foreignKey: "matchId",
    });
    Match.hasMany(MatchPlayerRound, {
      foreignKey: "matchId",
    });
  }

  /**
   * Connect.
   */
  connect(): Promise<void> {
    return this.postgres.connect();
  }

  /**
   * Create a new match.
   *
   * This might just need to call setState and setMetadata in
   * most implementations.
   *
   * However, it exists as a separate call so that the
   * implementation can provision things differently when
   * a match is created.  For example, it might stow away the
   * initial match state in a separate field for easier retrieval.
   */
  createMatch(matchID: string, opts: CreateMatchOpts): Promise<void> {
    return this.postgres.createMatch(matchID, opts);
  }

  /**
   * Create a new game.
   *
   * This might just need to call setState and setMetadata in
   * most implementations.
   *
   * However, it exists as a separate call so that the
   * implementation can provision things differently when
   * a game is created.  For example, it might stow away the
   * initial game state in a separate field for easier retrieval.
   *
   * @deprecated Use createMatch instead, if implemented
   */
  createGame(matchID: string, opts: CreateGameOpts): Promise<void> {
    return this.postgres.createGame(matchID, opts);
  }

  /**
   * Update the game state.
   *
   * If passed a deltalog array, setState should append its contents to the
   * existing log for this game.
   */
  setState(
    matchID: string,
    state: State,
    deltalog?: LogEntry[]
  ): Promise<void> {
    if (state.ctx.gameover !== undefined) {
      Match.findByPk(matchID)
        .then((match) => {
          if (!match) {
            throw `Could not find match with id ${matchID}`;
          }
          //
          const wizardState: WizardState = state.G;

          const playerUserIDs = Object.values(match.players).reduce(
            (acc, player) => ({ ...acc, [player.id]: player.data.userID }),
            {} as Record<number, string>
          );

          const leaders = getLeaders(wizardState.scorePad);

          const matchPlayerRounds = wizardState.scorePad.flatMap(
            (scoreRow, i) => {
              const isFinalRound = i + 1 === wizardState.scorePad.length;
              return scoreRow.playerScores.map((score, player) => ({
                matchId: matchID,
                round: scoreRow.numCards,
                playerId: playerUserIDs[player],
                bid: score.bid,
                tricks: score.tricks,
                score: score.score,
                total: score.total,
                winner:
                  isFinalRound && leaders.includes(player as PlayerID)
                    ? true
                    : undefined,
                negative: isFinalRound && score.total < 0 ? true : undefined,
              }));
            }
          );

          MatchPlayerRound.bulkCreate(matchPlayerRounds, { validate: true });
        })
        .catch((error) =>
          console.warn("Could not insert MatchPlayerRounds:", error)
        );
    }

    return this.postgres.setState(matchID, state, deltalog);
  }

  /**
   * Update the game metadata.
   */
  setMetadata(matchID: string, metadata: Server.MatchData): Promise<void> {
    // upsert players
    Object.values(metadata.players)
      .filter((player) => player.data?.userID !== undefined)
      .forEach((player) =>
        Player.upsert({
          id: player.data.userID,
          name: player.name,
        })
      );

    return this.postgres.setMetadata(matchID, metadata);
  }

  /**
   * Fetch the game state.
   */
  fetch<O extends FetchOpts>(
    matchID: string,
    opts: O
  ): Promise<FetchResult<O>> {
    return this.postgres.fetch(matchID, opts);
  }

  /**
   * Remove the game state.
   */
  wipe(matchID: string): Promise<void> {
    return this.postgres.wipe(matchID);
  }

  /**
   * Return all matches.
   */
  listMatches(opts?: ListMatchesOpts): Promise<string[]> {
    return this.postgres.listMatches(opts);
  }

  /**
   * Return all games.
   *
   * @deprecated Use listMatches instead, if implemented
   */
  listGames(opts?: ListGamesOpts): Promise<string[]> {
    return this.postgres.listGames(opts);
  }
}
