import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common'
import { TokenService } from './token.service'
import { TokenUnit } from './entities'
import { UpdateFavoriteDto, CreateTokenTxDto } from './dto'

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  getAllTokens() {
    return this.tokenService.getAllTokens()
  }

  @Get(':unit/favorite')
  getFavoriteStatus(@Param('unit') unit: TokenUnit) {
    return this.tokenService.getFavoriteStatus(unit)
  }

  @Patch(':unit/favorite')
  updateFavoriteStatus(
    @Param('unit') unit: TokenUnit,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return this.tokenService.updateFavoriteStatus(unit, updateFavoriteDto)
  }

  @Post(':unit')
  saveTokenTransaction(
    @Param('unit') unit: TokenUnit,
    @Body() createTokenTxDto: CreateTokenTxDto,
  ) {
    return this.tokenService.saveTokenTransaction(unit, createTokenTxDto)
  }

  @Get(':unit/comments')
  getTokenTransactions(@Param('unit') unit: TokenUnit) {
    return this.tokenService.getTokenTransactions(unit)
  }

  @Get('total-value')
  getTotalValue() {
    return this.tokenService.getTotalValue()
  }
}
