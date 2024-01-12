import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Freelancer } from 'src/freelancer/entities/freelancer.entity';
import { JobSkillService } from 'src/job-skill/job-skill.service';
import { JobUser } from 'src/job-user/entities/job-user.entity';
import { UserSkillsService } from 'src/user-skills/user-skills.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { StatusEnum } from './status/status.enum';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(Freelancer) private freelancerRepository: Repository<Freelancer>,
    @InjectRepository(JobUser) private jobUserRepository: Repository<JobUser>,
    private readonly jobSkillsService: JobSkillService,
  ) { }

  async create(createJobDto: any) {
    const { skills, ...data } = createJobDto
    const job = await this.jobRepository.save({ ...data, status: StatusEnum.START })
    console.log(job);
    if (skills && skills.length) {
      for (let e of skills) {
        await this.jobSkillsService.create({ jobId: job.id, skillId: e })
      }
    }
    return 'adds a new job';
  }

  async findAll() {
    return this.jobRepository.find();
  }

  async findOne(id: number) {
    const job = await this.jobRepository.findOne({
      where: {
        id: id
      },
      relations: ["jobSkills", "jobSkills.skill", 'freelancer', 'freelancer.user']
    })
    if (!job) {
      throw new NotFoundException("Oops! job not fount")
    } else {
      return job
    }
  }
  async findJobsByCustomerId(id: number, status: number) {
    if (status) {
      const job = await this.jobRepository.find({
        where: {
          customerId: id,
          status
        },
        relations: ["jobSkills", "jobSkills.skill", 'freelancer', 'freelancer.user']
      })
      if (!job) {
        throw new NotFoundException("Oops! job not fount")
      } else {
        return job
      }

    } else {
      const job = await this.jobRepository.find({
        where: {
          customerId: id
        },
        relations: ["jobSkills", "jobSkills.skill", 'freelancer', 'freelancer.user']
      })
      if (!job) {
        throw new NotFoundException("Oops! job not fount")
      } else {
        return job
      }
    }
  }
  async findJobsByFreelancerId(id: number, status: number) {
    console.log(id, status);

    if (status) {
      const job = await this.jobRepository.find({
        where: {
          freelancerId: id,
          status
        },
        relations: ["jobSkills", "jobSkills.skill", 'customer']
      })
      if (!job) {
        throw new NotFoundException("Oops! job not fount")
      } else {
        return job
      }
    } else {

      const job = await this.jobRepository.find({
        where: {
          freelancerId: id
        },
        relations: ["jobSkills", "jobSkills.skill", 'customer']
      })
      if (!job) {
        throw new NotFoundException("Oops! job not fount")
      } else {
        return job
      }
    }
  }
  async findJobsByFreelancerIdgetFeedback(id: number) {
    const job = await this.jobRepository.find({
      where: {
        freelancerId: id,
        status: 2
      },
    })
    return { job, rate: job.reduce((a, b) => a + b.rate, 0) / job.length }
  }
  async findJobsByStatus(status: number) {
    const job = await this.jobRepository.find({
      where: {
        status
      },
      relations: {
        jobSkills: true
      }
    })
    if (!job) {
      throw new NotFoundException("Oops! job not fount")
    } else {
      return job
    }

  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const job = await this.jobRepository.findOne({
      where: {
        id: id
      }
    })
    if (job) {
      await this.jobRepository.update({ id }, updateJobDto);
      return `Updated job - ${job.title}`;
    } else {
      return new NotFoundException('Oops! job not found');
    }
  }
  async updateJobStatus(id: number, { status }: { status: number }) {
    const job = await this.jobRepository.findOne({
      where: {
        id: id
      }
    })
    if (job) {
      if (status == 0 || status == 1 || status == 2) {
        await this.jobRepository.update({ id }, { status: status });
        return `Updated job - ${job.title}`;
      } else {
        throw new NotFoundException('Oops! status value invalid');
      }
    } else {
      throw new NotFoundException('Oops! job not found');
    }
  }
  async saveFreelancer({ jobId, freelancerId }: { jobId: number, freelancerId: number }) {
    const job = await this.jobRepository.findOne({
      where: {
        id: jobId
      }
    })
    if (!job) {
      throw new NotFoundException('Oops! job not found');
    }
    const user = await this.userRepository.findOneBy({ id: freelancerId })
    if (user) {
      const freelancer = await this.freelancerRepository.findOne({
        where: {
          user
        }
      })
      if (!freelancer) {
        throw new NotFoundException('Oops! freelancer not found');
      }
      await this.jobRepository.update({ id: jobId }, { freelancerId })
      await this.jobUserRepository.delete({ jobId })
      return "update freelancer id"
    } else {
      throw new NotFoundException('Oops! user not found');
    }
  }
  async remove(id: number) {
    const job = await this.jobRepository.findOneBy({ id });
    if (job) {
      this.jobRepository.delete({ id })
      return "delete job - " + job.title;
    } else {
      throw new NotFoundException('Oops! job not found');
    }
  }
}
