import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  async getDataPost(page: number) {
    const skip = (Number(page) - 1) * 10;
    console.log(skip);

    const dataPost = await this.prismaService.post.findMany({
      orderBy: { post_id: 'desc' },
      skip,
    });

    return dataPost;
  }
}
