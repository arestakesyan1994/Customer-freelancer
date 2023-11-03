import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { User } from 'src/user/entities/user.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Feedback, User, Job])],
  controllers: [FeedbackController],
  providers: [FeedbackService]
})
export class FeedbackModule {}
