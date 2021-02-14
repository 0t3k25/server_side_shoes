import { Get, JsonController, NotFoundError, Param } from 'routing-controllers'
import { getCustomRepository } from 'typeorm'
import { EntityFromParam } from 'typeorm-routing-controllers-extensions'
import { Shoe } from '../entity/Shoe'
import { ShoeRepository } from '../repository/ShoeRepository'

@JsonController('/shoes')
export class ShoeController {
  @Get('/:id')
  get(@EntityFromParam('id') shoe: Shoe): Shoe {
    if (!shoe) {
      throw new NotFoundError('shoe was not found !')
    }
    return shoe
  }

  @Get('/categories/:category')
  async getByCategory(@Param('category') category: string): Promise<Shoe[]> {
    const repository = getCustomRepository(ShoeRepository)
    return await repository.findByCategory(category)
  }
}
