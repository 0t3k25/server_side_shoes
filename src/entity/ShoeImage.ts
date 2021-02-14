import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Shoe } from './Shoe'

@Entity()
export class ShoeImage {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  url!: string

  @ManyToOne(() => Shoe, (shoe) => shoe.images)
  shoe!: Shoe
}
