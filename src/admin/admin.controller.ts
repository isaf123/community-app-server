import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  CreateAdminRequest,
  LoginAdminRequest,
  UpdatePostRequest,
} from 'model/admin.model';
import { Auth } from 'src/common/auth.decorator';
import e from 'express';

@Controller('/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/post-list')
  async getDataPost(@Query('page') req: number) {
    const response = await this.adminService.getDataPost(req);
    return response;
  }

  @Post('/create-admin')
  async createAdmin(@Body() request: CreateAdminRequest) {
    const response = await this.adminService.createAdmin(request);
    return response;
  }

  @Post('/login-admin')
  async loginAdmin(@Body() request: LoginAdminRequest) {
    const response = await this.adminService.loginAdmin(request);
    return response;
  }

  @Delete('/delete-post')
  async deletePost(@Auth() token: string, @Query('post_id') request: string) {
    const response = await this.adminService.deletePost(token, request);
    return response;
  }

  @Patch('/update-post')
  async updatePost(@Auth() token: string, @Body() request: UpdatePostRequest) {
    const response = await this.adminService.updatePost(token, request);
    return response;
  }

  @Get('/user-list')
  async getUserList(@Query('page') req: number) {
    const response = await this.adminService.getUserDataList(req);
    return response;
  }

  @Get('/user-chart')
  async getUserChart(@Query('start') start: string, @Query('end') end: string) {
    const response = await this.adminService.userChart(start, end);
    return response;
  }

  @Get('/post-chart')
  async getPostChart(@Query('start') start: string, @Query('end') end: string) {
    const response = await this.adminService.postChart(start, end);
    return response;
  }

  @Get('/tag-chart')
  async getTagChart(@Query('start') start: string, @Query('end') end: string) {
    const response = await this.adminService.tagChart(start, end);
    return response;
  }

  @Get('/stat')
  async getDashboardStat(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    const response = await this.adminService.dashboardStat(start, end);
    return response;
  }
}
