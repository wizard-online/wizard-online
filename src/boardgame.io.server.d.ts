declare module "boardgame.io/server" {
  export interface Server {
    run(port: number, onStart: () => void): Promise<any>;
    kill(args: any): void;
  }
  export function Server(options: object): Server;
}
