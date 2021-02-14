import { EntityRepository, Repository } from 'typeorm'
import { Shoe } from '../entity/Shoe'

@EntityRepository(Shoe)
export class ShoeRepository extends Repository<Shoe> {
  findByCategory(category: string): Promise<Shoe[]> {
    return this.find({ where: { category: category }, take: 20 })
  }
}
