import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest } from 'model/user.model';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/regis')
  @HttpCode(200)
  async register(@Body() request: RegisterUserRequest) {
    const result = await this.userService.register(request);
    return result;
  }
}
