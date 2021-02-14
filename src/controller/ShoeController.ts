import { Get, JsonController, NotFoundError } from 'routing-controllers'
import { Shoe } from '../entity/Shoe'
import { EntityFromParam } from 'typeorm-routing-controllers-extensions'

@JsonController()
export class ShoeController {
  @Get('/shoes/:id')
  get(@EntityFromParam('id') shoe: Shoe): Shoe {
    if (!shoe) {
      throw new NotFoundError('shoe was not found !')
    }
    return shoe
  }
}
