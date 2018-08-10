import { Controller, Get } from 'routing-controllers';
import Game from './entities';

@Controller()
export default class MainController {
  @Get("/games")
  async getGames() {
    const games = await Game.find()
    return games
  }
}