import {
  Body,
  Get,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Res,
} from 'routing-controllers'
import { Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Shoe } from '../entity/Shoe'
import { ShoeRepository } from '../repository/ShoeRepository'

@JsonController('/shoes')
export class ShoeController {
  shoeRepository = getCustomRepository(ShoeRepository)

  @Get('/:id')
  async get(@Param('id') id: string, @Res() res: Response): Promise<any> {
    const shoe = await this.shoeRepository.findOne(id, {
      relations: ['images'],
    })
    if (!shoe) {
      throw new NotFoundError('shoe was not found !')
    }
    return res.json(shoe)
  }

  @Get('/categories/:category')
  async getByCategory(@Param('category') category: string): Promise<any> {
    const shoes = await this.shoeRepository.findByCategory(category)
    return { shoes: shoes }
  }

  @Post('/')
  async create(@Body() body: Array<Shoe>, @Res() res: Response): Promise<any> {
    const model = this.shoeRepository.create(body)
    await this.shoeRepository.save(model)
    return res.json({ shoes: model })
  }
}
