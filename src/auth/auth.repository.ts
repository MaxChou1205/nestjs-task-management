import { PrismaService } from '@/prisma.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        // unique constraint failed
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async find(username: string) {
    const user = await this.prisma.user.findFirst({ where: { username } });
    return user;
  }
}
