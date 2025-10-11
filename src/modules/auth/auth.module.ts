import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BcryptService } from '../../common/services/bcrypt.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, Logger],
})
export class AuthModule {}
