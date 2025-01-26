import { Injectable } from '@nestjs/common';
import { CreatePostRequest, PostCommentRequest } from 'model/post.model';
import { PrismaService } from 'src/common/prisma.service';
import { PostValidation } from './post.validation';
import { ValidationService } from 'src/common/validation.service';
import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { response } from 'express';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}
  async CreatePostRequest(token: string, request: CreatePostRequest) {
    this.validationService.validate(PostValidation.create, request);
    const checkToken = jwt.verify(token, 'secret') as jwt.JwtPayload;
    const tags = request.tags.join(',');
    const response = await this.prismaService.post.create({
      data: {
        user_id: checkToken.id,
        title: request.title,
        content: request.content,
        tags,
      },
    });
    return response;
  }

  async GetPostRequest(tags?: string) {
    const tagsArr = tags?.split(',');
    const filterTags = tagsArr?.map((val) => {
      return { tags: { contains: val, mode: Prisma.QueryMode.insensitive } };
    });

    const response = await this.prismaService.post.findMany({
      where: tags ? { AND: filterTags } : {},
      include: {
        Comment: {
          include: { _count: true, User: { select: { username: true } } },
          orderBy: { comment_id: 'desc' },
        },
        Like: { include: { User: { select: { username: true } } } },
        User: { select: { username: true } },
      },
      orderBy: { post_id: 'desc' },
    });
    return response;
  }

  async PostComment(token: string, request: PostCommentRequest) {
    this.validationService.validate(PostValidation.comment, request);
    const checkToken = jwt.verify(token, 'secret') as jwt.JwtPayload;
    const response = await this.prismaService.comment.create({
      data: {
        content: request.content,
        user_id: checkToken.id,
        post_id: request.post_id,
      },
    });
    return response;
  }

  async LikeUnLikePost(token: string, request: number) {
    const checkToken = jwt.verify(token, 'secret') as jwt.JwtPayload;
    const post_id = Number(request);
    const findLikePost = await this.prismaService.like.findFirst({
      where: {
        post_id,
        user_id: checkToken.id,
      },
    });
    if (!findLikePost) {
      const response = await this.prismaService.like.create({
        data: {
          post_id,
          user_id: checkToken.id,
        },
      });
      return 'like post success';
    } else {
      const response = await this.prismaService.like.delete({
        where: {
          like_id: findLikePost.like_id,
        },
      });
      return 'unlike post success';
    }
  }
}
