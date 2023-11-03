import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateJobUserDto } from './dto/create-job-user.dto';
import { JobUser } from './entities/job-user.entity';

@Injectable()
export class JobUserService {
  constructor(
    @InjectRepository(JobUser) private jobUserRepository: Repository<JobUser>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,

  ) { }

  async create(createJobUserDto: any) {
    const user = await this.userRepository.findOneBy({ id: createJobUserDto.userId })
    if (!user) {
      throw new NotFoundException('Oops! user not found');
    }
    const job = await this.jobRepository.findOneBy({ id: createJobUserDto.jobId })
    if (!job) {
      throw new NotFoundException('Oops! job not found');
    }
    const userjob = await this.jobUserRepository.findOne({
      where: {
        freelancerId: createJobUserDto.userId,
        jobId: createJobUserDto.jobId
      },
    })
    if (userjob) {
      throw new NotFoundException('Oops! jobUser has already');
    } else {
      await this.jobUserRepository.save(createJobUserDto)
      return 'adds a new jobUser';
    }
  }

  async findByJobId(id: number) {
    const job = await this.jobUserRepository.find({
      where: {
        jobId:id
      },
      relations: {
        freelancer: true
      }
    })
    if (!job) {
      throw new NotFoundException("Oops! job not fount")
    } else {
      return job
    }
  }

  async findByUserId(id: number) {
    const job = await this.jobUserRepository.find({
      where: {
        freelancerId:id
      },
      relations: {
        job: true
      }
    })
    if (!job) {
      throw new NotFoundException("Oops! job not fount")
    } else {
      return job
    }
  }

  async updateJobStatus(id: number,{num} : {num:number}) {
    const job = await this.jobUserRepository.findOne({
      where: {
        id: id
      }
    })
    if (job) {
      if(num==0 || num==1){
        await this.jobUserRepository.update({ id }, {done:num});
        if(num==1){
          await this.jobUserRepository.delete({jobId:job.jobId})
          
        }
        return `Updated job - ${job.id}`;
      }else{
        throw new NotFoundException('Oops! done value invalid');
      }
    } else {
      throw new NotFoundException('Oops! jobUser not found');
    }
  }

  async remove(id: number) {
    const job = await this.jobUserRepository.findOneBy({ id });
    if (job) {
      this.jobUserRepository.delete({ id })
      return "delete job - " + job.id;
    } else {
      throw new NotFoundException('Oops! jobUser not found');
    }
  }
}
