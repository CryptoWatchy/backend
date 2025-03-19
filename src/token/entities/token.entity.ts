import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { TokenTx } from './token-tx.entity'

export enum TokenUnit {
  BITCOIN = 'Bitcoin',
  ETHEREUM = 'Ethereum',
  POLYGON = 'Polygon',
  POLKADOT = 'Polkadot',
  SOLANA = 'Solana',
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: TokenUnit,
    enumName: 'token_unit_enum',
    unique: true,
  })
  unit: TokenUnit

  @Column({ type: 'boolean', default: false })
  favorite: boolean

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  amount: number

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  price: number

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  value: number

  @Column({ type: 'timestamp', nullable: true })
  priceUpdateDate: Date

  @OneToMany(() => TokenTx, (tx) => tx.token)
  transactions: TokenTx[]
}
