import { Server } from 'boardgame.io/server';
import { Wizard } from './Game';

const server = Server({
  games: [Wizard],

});



// eslint-disable-next-line no-console
server.run(8000, () => console.log("server running..."));