import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Request, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { Role } from 'src/user/role/role.enum';

@Controller('feedback')
@ApiTags("Feedback*")
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.CUSTOMER)
  @Post()
  async create(@Body() createFeedbackDto: CreateFeedbackDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.feedbackService.create({ ...createFeedbackDto, user: req.user });
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('findFeedbackByJobId/:id')
  async findFeedbackByJobId(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.feedbackService.findFeedbackByJobId(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.CUSTOMER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto, @Res() res: Response) {
    try {
      const data = await this.feedbackService.update(+id, updateFeedbackDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.CUSTOMER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.feedbackService.remove(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }
}
