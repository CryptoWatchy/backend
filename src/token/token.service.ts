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
    console.log('Tokens: ', TokenUnit)
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
    let token = await this.tokenRepository.findOne({ where: { unit } })

    if (!token) {
      token = this.tokenRepository.create({
        unit,
        favorite: false,
        amount: 0,
        price: 0,
        value: 0,
      })

      token = await this.tokenRepository.save(token)
    }

    token.amount = Number(token.amount) + Number(createTokenTxDto.amount)
    token.value = Number(token.amount) * Number(token.price)

    await this.tokenRepository.save(token)

    const tx = this.tokenTxRepository.create({
      token,
      tokenUnit: unit,
      amount: Number(createTokenTxDto.amount),
      price: Number(token.price),
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

    const totalValue = tokens.reduce(
      (sum, token) => sum + Number(token.value),
      0,
    )

    return parseFloat(totalValue.toFixed(2))
  }
}
