import { Module } from '@nestjs/common'
import { TokenController } from './token.controller'
import { TokenService } from './token.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Token, TokenTx } from './entities'
import { TokenPriceService } from './token-price.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [TypeOrmModule.forFeature([Token, TokenTx]), HttpModule],
  controllers: [TokenController],
  providers: [TokenService, TokenPriceService],
})
export class TokenModule {}
