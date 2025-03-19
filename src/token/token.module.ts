import { Module } from '@nestjs/common'
import { TokenController } from './token.controller'
import { TokenService } from './token.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Token, TokenTx } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([Token, TokenTx])],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
