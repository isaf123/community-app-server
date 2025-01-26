import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, LoginUserRequest } from 'model/user.model';
import { Auth } from 'src/common/auth.decorator';
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/regis')
  @HttpCode(200)
  async register(@Body() request: RegisterUserRequest) {
    const result = await this.userService.register(request);
    return result;
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() request: LoginUserRequest) {
    const result = await this.userService.loginUser(request);
    return result;
  }

  @Get('/get-user')
  @HttpCode(200)
  async getUser(@Auth() token) {
    const result = await this.userService.getUserData(token);
    return result;
  }
}
