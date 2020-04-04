declare module "boardgame.io/server" {
  export interface Server {
    run(port: number, onStart: () => void): void;
  }
  export function Server(options: object): Server;
}
