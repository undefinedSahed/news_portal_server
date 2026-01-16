import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // admin user credentials
  private admin = {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
  };

  async login(username: string, password: string) {
    if (username !== this.admin.username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, this.admin.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username };
    return {
      username: username,
      access_token: this.jwtService.sign(payload),
    };
  }
}
