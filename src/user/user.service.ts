import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserValidation } from './user.validation';
import { RegisterUserRequest } from 'model/user.model';

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

    const user = await this.prismaService.user.create({
      data: request,
    });
    return {
      user: user.username,
      name: user.name,
    };
  }
}
