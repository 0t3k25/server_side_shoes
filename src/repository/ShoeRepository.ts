import { EntityRepository, Repository, In } from 'typeorm'
import { Shoe } from '../entity/Shoe'
import { notEqual } from 'assert'

@EntityRepository(Shoe)
export class ShoeRepository extends Repository<Shoe> {
  findByCategory(category: string): Promise<Shoe[]> {
    return this.find({
      relations: ['images'],
      where: { category: category },
      take: 20,
    })
  }
  findByGender(gender: string): Promise<Shoe[]> {
    return this.find({
      where: { gender: In([gender, 'UNISEX']) },
      relations: ['images'],
      take: 20,
    })
  }
}
