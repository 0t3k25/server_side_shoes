import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ShoeImage } from './ShoeImage'

@Entity()
export class Shoe {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  description!: string

  @Column()
  brandName!: string

  @Column()
  category!: string

  @Column()
  listPriceJPY!: number

  @OneToMany(() => ShoeImage, (shoeImage) => shoeImage.shoe, { cascade: true })
  images!: ShoeImage[]
}
