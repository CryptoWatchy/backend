import * as dotenv from 'dotenv'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' })
} else {
  dotenv.config({ path: '.env.production' })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const PORT = process.env.PORT_BACKEND || 3001

  /** @dev Allows us to use validation pipes in our app */
  /** @dev 'whitelist: true' gets rid of undefined elements in body and clears them */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  await app.listen(PORT)
  console.log(`Server is running at port: ${PORT}`)
}

bootstrap()
