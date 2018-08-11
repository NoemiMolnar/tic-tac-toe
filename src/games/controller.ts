import { JsonController, Get, Post, HttpCode, Body, Put, Param, NotFoundError } from 'routing-controllers';
import Game from './entities';

@JsonController()
export default class MainController {
  @Get("/games")
  async getGames() {
    const games = await Game.find()
    return games
  }

  newColor = () => {
    const random = Math.floor(Math.random() * 5)
    switch (random) {
      case 0:
        return "red"
      case 1:
        return "blue"
      case 2:
        return "green"
      case 3:
        return "yellow"
      default:
        return "magenta"
    }
  }

  @Post('/games')
  @HttpCode(201)
  createGame(
    @Body() game: Game
  ) {
    game.color = this.newColor()
    game.board = [["o", "o", "o"], ["o", "o", "o"], ["o", "o", "o"]]
    return game.save()
  }

  @Get('/games/:id')
  async getGame(
    @Param('id') id: number
  ): Promise<Game | undefined> {
    return await Game.findOne(id)
  }


  @Put('/games/:id')
  async updateGame(
    @Param('id') id: number,
    @Body() update: Partial<Game>
  ) {

    const game = await Game.findOne(id)
    if (!game) {
      throw new NotFoundError('Cannot find page')
    } else {
      if (Object.keys(update).includes('id')) {
        console.log("changing the id is not allowed")
        delete update.id
      }
      let newColor = this.newColor()
      while (newColor===game.color){
        newColor = this.newColor()
      }
      update.color = newColor 

      return Game.merge(game, update).save()
    }
  }


  // @Put("/games/:id")
  // put(@Param("id") id: number, 
  //   @Body() game: Game)
  // {
  //   return Game.findOne(id);
  // }

}


