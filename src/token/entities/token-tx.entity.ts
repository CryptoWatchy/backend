import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { Token, TokenUnit } from './token.entity'

@Entity()
export class TokenTx {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Token, (token) => token.transactions)
  token: Token

  @Column({
    type: 'enum',
    enum: TokenUnit,
    enumName: 'token_unit_enum',
  })
  tokenUnit: TokenUnit

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  amount: number

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  price: number

  @Column({ type: 'text', nullable: true })
  comment?: string

  @CreateDateColumn()
  createdAt: Date
}
