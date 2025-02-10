import { Body, Controller, HttpCode, Post, Query, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { Auth } from 'src/common/auth.decorator';
import { CreatePostRequest, PostCommentRequest } from 'model/post.model';

@Controller('/post')
export class PostController {
  constructor(private postService: PostService) {}
  @Get('/')
  async getPost(@Query('tags') request: string) {
    const result = this.postService.GetPostRequest(request);
    return result;
  }

  @Post('/create')
  @HttpCode(200)
  async getUser(@Auth() token: string, @Body() request: CreatePostRequest) {
    const result = await this.postService.CreatePostRequest(token, request);
    return { title: result.title, message: 'Create Post Success' };
  }

  @Post('create-comment')
  @HttpCode(200)
  async postComment(
    @Auth() token: string,
    @Body() request: PostCommentRequest,
  ) {
    await this.postService.PostComment(token, request);
    return { message: 'create comment success' };
  }

  @Get('/like-post')
  @HttpCode(200)
  async likePost(@Auth() token: string, @Query('postid') req: number) {
    const result = await this.postService.LikeUnLikePost(token, req);
    return { message: result };
  }

  @Get('/tags-list')
  @HttpCode(200)
  async tagList() {
    const result = await this.postService.getTagList();
    return result;
  }
}
