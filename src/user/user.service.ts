import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserValidation } from './user.validation';
import { LoginUserRequest, RegisterUserRequest } from 'model/user.model';
import { hashPassword } from 'src/helper/hashpassword';
import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class UserService {
  constructor(
    private validationservice: ValidationService,
    private prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserRequest) {
    this.validationservice.validate(UserValidation.register, request);
    const findSameUsername = await this.prismaService.user.findFirst({
      where: {
        username: request.username,
      },
    });
    if (findSameUsername) {
      throw new HttpException('username already exist', 400);
    }
    const hash = await hashPassword(request.password);
    const date = new Date();

    const user = await this.prismaService.user.create({
      data: {
        name: request.name,
        username: request.username,
        password: hash,
        create_date: date.toISOString().split('T')[0],
      },
    });
    return {
      user: user.username,
      name: user.name,
    };
  }

  async getUserData(request) {
    const checkToken = jwt.verify(request, 'secret');
    return checkToken;
  }

  async loginUser(request: LoginUserRequest) {
    const findUser = await this.prismaService.user.findFirst({
      where: {
        username: request.username,
      },
    });
    if (!findUser) throw new HttpException('acccount not exist', 400);
    const nowDate = new Date();
    const suspendDate = new Date(findUser.updated_at);
    suspendDate.setDate(suspendDate.getDate() + 2);
    const differentDate = nowDate.getTime() > suspendDate.getTime();

    if (differentDate) {
      await this.prismaService.user.update({
        where: {
          user_id: findUser.user_id,
        },
        data: {
          login_failed: 0,
        },
      });
    }

    const comparePass = compareSync(request.password, findUser.password);
    if (comparePass) {
      await this.prismaService.user.update({
        where: {
          user_id: findUser.user_id,
        },
        data: {
          login_failed: 0,
        },
      });

      const token = jwt.sign(
        { id: findUser.user_id, username: findUser.username, role: 'user' },
        process.env.JWT_KEY || 'secret',
      );

      return {
        username: findUser.username,
        token,
        role: 'user',
      };
    }

    if (findUser.login_failed > 3)
      throw new HttpException('acccount pending', 401);

    if (!comparePass) {
      const trySignin = await this.prismaService.user.findFirst({
        where: { username: request.username },
      });

      if (!trySignin) throw new HttpException('account not exist', 400);

      await this.prismaService.user.update({
        where: {
          user_id: trySignin.user_id,
        },
        data: {
          login_failed: trySignin.login_failed + 1,
        },
      });
      const message =
        trySignin.login_failed !== 3
          ? `wrong password, ${3 - trySignin.login_failed} chances remaining`
          : 'wrong password account suspended';
      throw new HttpException(message, 401);
    }
  }
}
