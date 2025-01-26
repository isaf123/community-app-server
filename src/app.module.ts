import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { PostModule } from './post/post.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UserModule, CommonModule, PostModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
