import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm'
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

  @OneToOne(() => ShoeImage, (shoeImage) => shoeImage.shoe)
  mainImage!: ShoeImage

  @OneToMany(() => ShoeImage, (shoeImage) => shoeImage.shoe)
  images!: ShoeImage[]
}
