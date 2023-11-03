import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobSkillService } from 'src/job-skill/job-skill.service';
import { JobSkillModule } from 'src/job-skill/job-skill.module';

@Module({
  imports:[TypeOrmModule.forFeature([Job]), JobSkillModule ],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
