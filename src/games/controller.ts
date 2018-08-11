import { JsonController, Get, Post, HttpCode, Body, Put, Param, NotFoundError, OnUndefined } from 'routing-controllers';
import Game from './entities';

@JsonController()
export default class MainController {
  @Get("/games")
  async getGames() {
    const games = await Game.find()
    return games
  }

  colorArray: string[] = ['red', 'blue', 'green', 'yellow', 'magenta']

  newColor = () => {
    const random = Math.floor(Math.random() * 5)
    return this.colorArray[random]
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

  moves = (board1, board2) =>
    board1
      .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
      .reduce((a, b) => a.concat(b))
      .length


  @Put('/games/:id')
  @OnUndefined(400)
  async updateGame(
    @Param('id') id: number,
    @Body() update: Partial<Game>
  ) {

    const game = await Game.findOne(id)
    if (!game) {
      throw new NotFoundError('Cannot find page')
    } else {
      if (update.id !== undefined) {
        console.log("changing the id is not allowed")
        delete update.id
      }
      if (update.color !== undefined && !this.colorArray.includes(update.color)) {
        return undefined
      }
    }
    if (update.board !== undefined && this.moves(game.board, update.board) > 1) {
      return undefined

    }
    return Game.merge(game, update).save()
  }
}




