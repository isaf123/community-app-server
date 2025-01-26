export class CreatePostRequest {
  title: string;
  content: string;
  tags: String[];
}

export class PostCommentRequest {
  content: string;
  post_id: number;
}
