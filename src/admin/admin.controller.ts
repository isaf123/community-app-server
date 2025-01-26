import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/')
  async getDataPost(@Query('page') req: number) {
    const response = await this.adminService.getDataPost(req);
    return response;
  }
}
