declare module "boardgame.io/server" {
  export interface Server {
    run(port: number, onStart: () => void): Promise<unknown>;
    kill(args: unknown): void;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  export function Server(options: object): Server;
}
