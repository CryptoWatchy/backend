import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Token, TokenTx, TokenUnit } from './entities'
import { UpdateFavoriteDto, CreateTokenTxDto } from './dto'

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    @InjectRepository(TokenTx) private tokenTxRepository: Repository<TokenTx>,
  ) {
    console.log('Hi!: ', TokenUnit)
  }

  async getAllTokens() {
    return this.tokenRepository.find()
  }

  async getFavoriteStatus(unit: TokenUnit) {
    const token = await this.tokenRepository.findOne({ where: { unit } })

    return token ? token.favorite : null
  }

  async updateFavoriteStatus(
    unit: TokenUnit,
    updateFavoriteDto: UpdateFavoriteDto,
  ) {
    await this.tokenRepository.update(
      { unit },
      { favorite: updateFavoriteDto.favorite },
    )

    return { message: 'Favorite status updated' }
  }

  async saveTokenTransaction(
    unit: TokenUnit,
    createTokenTxDto: CreateTokenTxDto,
  ) {
    const token = await this.tokenRepository.findOne({ where: { unit } })
    if (!token) throw new Error('Token not found')

    token.amount += createTokenTxDto.amount
    token.value = token.amount * token.price
    await this.tokenRepository.save(token)

    const tx = this.tokenTxRepository.create({
      token,
      tokenUnit: unit,
      amount: createTokenTxDto.amount,
      price: token.price,
      comment: createTokenTxDto.comment,
    })
    await this.tokenTxRepository.save(tx)

    return { message: 'Transaction saved' }
  }

  async getTokenTransactions(unit: TokenUnit) {
    return this.tokenTxRepository.find({
      where: { tokenUnit: unit },
      order: { createdAt: 'DESC' },
    })
  }

  async getTotalValue() {
    const tokens = await this.tokenRepository.find()

    return tokens.reduce((sum, token) => sum + token.value, 0)
  }
}
