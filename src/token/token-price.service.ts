import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Token, TokenUnit } from './entities'
import { Cron } from '@nestjs/schedule'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class TokenPriceService {
  private readonly logger = new Logger(TokenPriceService.name)

  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    // Seed initial token data if database is empty
    const initialTokens: TokenUnit[] = [
      TokenUnit.BITCOIN,
      TokenUnit.ETHEREUM,
      TokenUnit.POLYGON,
      TokenUnit.POLKADOT,
      TokenUnit.SOLANA,
    ]

    for (const unit of initialTokens) {
      let token = await this.tokenRepository.findOne({
        where: { unit },
      })

      if (!token) {
        token = this.tokenRepository.create({
          unit: unit as TokenUnit,
          favorite: false,
          amount: 0,
          price: 0,
          value: 0,
        })

        token = await this.tokenRepository.save(token)
        this.logger.log(`Seeded new token: ${unit}`)
      }
    }
  }

  @Cron('0 */1 * * * *')
  async updateTokenPrices() {
    this.logger.log('Fetching token prices...')

    // Correct CoinGecko IDs mapping
    const tokenIds: Record<string, string> = {
      Bitcoin: 'bitcoin',
      Ethereum: 'ethereum',
      Polygon: 'matic-network',
      Polkadot: 'polkadot',
      Solana: 'solana',
    }

    const ids = Object.values(tokenIds).join(',')

    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
        ),
      )

      const prices = response.data

      for (const [unit, coingeckoId] of Object.entries(tokenIds)) {
        const price = prices[coingeckoId]?.usd
        // console.log(`Price for ${unit} (${coingeckoId}): `, price)

        if (price) {
          let token = await this.tokenRepository.findOne({
            where: { unit: unit as TokenUnit },
          })

          if (!token) {
            token = this.tokenRepository.create({
              unit: unit as TokenUnit,
              favorite: false,
              amount: 0,
              price: 0,
              value: 0,
            })

            token = await this.tokenRepository.save(token)
          }

          if (!token) {
            this.logger.warn(`Token ${unit} not found in the database.`)
            continue
          }

          // Calculate new value
          const newValue = Number(token.amount) * Number(price)

          // Update price and value
          await this.tokenRepository.update(
            { unit: unit as TokenUnit }, // Use your enum name
            { price, value: newValue, priceUpdateDate: new Date() },
          )

          this.logger.log(
            `Updated ${unit} price to ${price}, value to ${newValue}`,
          )
        } else {
          this.logger.warn(`Price for ${unit} not found in API response.`)
        }
      }
    } catch (error) {
      this.logger.error('Error fetching token prices', error)
    }
  }
}
