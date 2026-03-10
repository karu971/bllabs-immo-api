import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export type UserPayload = { id: string; email: string; role: Role };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      access_token: token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async getMe(userId: string): Promise<UserPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  /** Liste des utilisateurs (id, email, role) — sans mot de passe. */
  async listUsers(): Promise<UserPayload[]> {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true },
      orderBy: { email: 'asc' },
    });
  }
}
