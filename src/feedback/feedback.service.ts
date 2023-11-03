import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Feedback) private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,

  ) { }


  async create(createFeedbackDto: any) {
    const us = await this.userRepository.findOneBy({ id: createFeedbackDto.user.userId })
    if (!us) {
      throw new NotFoundException('user not found');
    }
    const job = await this.jobRepository.findOneBy({ id: createFeedbackDto.jobId })
    if (!job) {
      throw new NotFoundException('job not found');
    }
    const feed = await this.feedbackRepository.findOne({
      where: {
        customerId: createFeedbackDto.user.customer[0].id,
        jobId: createFeedbackDto.jobId
      },
    })
    if (feed) {
      throw new NotFoundException('jobUser has already');
    } else {
      const { user, ...data } = createFeedbackDto;
      if (job.customerId == user.customer[0].id) {
        await this.feedbackRepository.save(data)
        return 'adds a new order';
      } else {
        throw new NotFoundException('you do not have access');
      }
    }
  }

  async findFeedbackByJobId(id: number) {
    return this.feedbackRepository.find({
      where: {
        jobId: id
      },
      relations: [
        'customer', 'customer.user', 'job'
      ]
    });
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    const feed = await this.feedbackRepository.findOneBy({ id });
    if (feed) {
      this.feedbackRepository.update({ id }, updateFeedbackDto)
      return "update feedback - " + feed.id;
    } else {
      throw new NotFoundException('feedback not found');
    }
  }

  async remove(id: number) {
    const us = await this.feedbackRepository.findOneBy({ id });
    if (us) {
      this.feedbackRepository.delete({ id })
      return "delete feedback - " + us.id;
    } else {
      throw new NotFoundException('feedback not found');
    }
  }
}
