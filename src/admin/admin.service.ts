import { HttpException, Injectable } from '@nestjs/common';
import { CreateAdminRequest, UpdatePostRequest } from 'model/admin.model';
import { PrismaService } from 'src/common/prisma.service';
import { hashPassword } from 'src/helper/hashpassword';
import { compareSync } from 'bcrypt';
import { isoDate } from 'src/common/utils/date-helper';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminService {
  private date: isoDate;
  constructor(private prismaService: PrismaService) {
    this.date = new isoDate();
  }
  async getDataPost(page: number) {
    const skip = (Number(page) - 1) * 12;
    const dataPost = await this.prismaService.post.findMany({
      orderBy: [{ post_id: 'desc' }],
      skip,
      take: 12,
      include: { Comment: true, User: true, Like: true },
    });
    const countDataPost = await this.prismaService.post.count();
    const maxPage = Math.ceil(countDataPost / 12);

    return { data: dataPost, count: maxPage };
  }

  async getUserDataList(page: number) {
    const skip = Number(page - 1) * 12;
    const userList = await this.prismaService.user.findMany({
      orderBy: [{ user_id: 'desc' }],
      skip,
      take: 12,
      include: { _count: true },
    });
    const countUser = await this.prismaService.user.count();
    const maxPage = Math.ceil(countUser / 12);

    return { data: userList, count: maxPage };
  }

  async createAdmin(request: CreateAdminRequest) {
    const { adminname, name, password } = request;
    const findAccount = await this.prismaService.admin.findFirst({
      where: { adminname },
    });
    if (findAccount) throw new HttpException('account already exist', 400);

    const passwordHash = await hashPassword(password);
    const create = await this.prismaService.admin.create({
      data: {
        adminname,
        name,
        password: passwordHash,
      },
    });
    return { name: create.adminname, message: 'create admin success' };
  }

  async loginAdmin(request) {
    const { adminname, password } = request;
    const result = await this.prismaService.admin.findFirst({
      where: { adminname },
    });
    if (!result) throw new HttpException('account not exist', 400);

    const comparePass = compareSync(password, result.password);
    if (!comparePass) throw new HttpException('wrong password', 400);

    const token = jwt.sign(
      { id: result.admin_id, username: result.adminname, role: 'admin' },
      process.env.JWT_KEY || 'secret',
    );

    return { username: result.adminname, token, message: 'login success' };
  }

  async deletePost(token: string, post_id: string) {
    const checkToken = jwt.verify(token, 'secret') as jwt.JwtPayload;
    if (checkToken.role !== 'admin') {
      throw new HttpException('Unautorized', 400);
    }
    await this.prismaService.post.delete({
      where: {
        post_id: Number(post_id),
      },
    });

    return { message: 'post deleted success' };
  }

  async updatePost(token: string, request: UpdatePostRequest) {
    const checkToken = jwt.verify(token, 'secret') as jwt.JwtPayload;
    if (checkToken.role !== 'admin') {
      throw new HttpException('Unauthorized', 400);
    }

    await this.prismaService.post.update({
      where: {
        post_id: request.post_id,
      },
      data: {
        content: request.content,
      },
    });

    return { message: 'update post success' };
  }

  async userChart(start: string, end: string) {
    const startDate = this.date.getIsoStart(start);
    const endDate = this.date.getIsoEnd(end);

    const result = await this.prismaService.user.groupBy({
      by: ['create_date'],
      _count: true,
      where: start
        ? endDate
          ? { create_date: { gte: startDate, lte: endDate } }
          : { create_date: { gte: startDate } }
        : {},
      orderBy: {
        create_date: 'asc',
      },
    });
    return result;
  }

  async postChart(start: string, end: string) {
    const startDate = this.date.getIsoStart(start);
    const endDate = this.date.getIsoEnd(end);

    const result = await this.prismaService.post.groupBy({
      by: ['create_date'],
      _count: true,
      where: start
        ? endDate
          ? { create_date: { gte: startDate, lte: endDate } }
          : { create_date: { gte: startDate } }
        : {},
      orderBy: {
        create_date: 'asc',
      },
    });
    return result;
  }

  async tagChart(start: string, end: string) {
    const startDate = this.date.getIsoStart(start);
    const endDate = this.date.getIsoEnd(end);

    const tags = await this.prismaService.tags.findMany({
      select: { tag: true },
    });

    const post = await this.prismaService.post.findMany({
      select: { tags: true },
      where: start
        ? endDate
          ? { create_date: { gte: startDate, lte: endDate } }
          : { create_date: { gte: startDate } }
        : {},
    });

    const tagsCount = tags.map((val) => {
      const postFilter = post.filter((item) => item.tags.includes(val.tag));
      return { tag: val.tag, count: postFilter.length };
    });

    return tagsCount;
  }

  async dashboardStat(start, end) {
    const startDate = this.date.getIsoStart(start);
    const endDate = this.date.getIsoEnd(end);

    const totalUser = await this.prismaService.user.count({
      where: start
        ? endDate
          ? { create_date: { gte: startDate, lte: endDate } }
          : { create_date: { gte: startDate } }
        : {},
    });

    const totalPost = await this.prismaService.post.count({
      where: start
        ? endDate
          ? { create_date: { gte: startDate, lte: endDate } }
          : { create_date: { gte: startDate } }
        : {},
    });

    const totalTag = await this.prismaService.tags.count();

    return { user: totalUser, post: totalPost, tag: totalTag };
  }
}
