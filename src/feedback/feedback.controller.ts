import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { Role } from 'src/user/role/role.enum';
import { CreateFeedbackDto } from './dto/CreateFeedbackDto';

@Controller('feedback')
@ApiTags("Feedback*")
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.CUSTOMER)
  @ApiResponse({ description: "customer-ին հնարավորություն է տալիս ավարտված job-ի համար գրել feedback,\n ըստ որում ամեն մի job-ի համար հնարավոր է գրել միայն մի feedback\n և feedback կարող է գրել այն customer ով այդ job-ը ավելացրել է" })
  @Post(":jobId")
  async create(@Param("jobId")jobId:number,@Body() createFeedbackDto: CreateFeedbackDto, @Res() res: Response, @Request() req) {
    try {
      if (req.user.roles == 1) {
        const data = await this.feedbackService.create({ ...createFeedbackDto, user: req.user,  jobId});
        return res.status(HttpStatus.OK).json(data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Oops! you do not have access' })
      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }
}
