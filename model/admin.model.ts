export class CreateAdminRequest {
  adminname: string;
  password: string;
  name: string;
}

export class LoginAdminRequest {
  adminname: string;
  password: string;
}

export class UpdatePostRequest {
  content: string;
  post_id: number;
}
