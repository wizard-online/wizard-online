import { PostgresStore } from "bgio-postgres";
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
import { Player, playerAttributes } from "./entities/Player";

export class ServerPostgres extends Async {
  constructor(private postgres: PostgresStore) {
    super();
    Player.init(playerAttributes, { sequelize: postgres.sequelize });
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
    return this.postgres.setState(matchID, state, deltalog);
  }

  /**
   * Update the game metadata.
   */
  setMetadata(matchID: string, metadata: Server.MatchData): Promise<void> {
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
