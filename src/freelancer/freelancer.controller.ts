import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Res, Query } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';

@ApiTags("Freelancer*")
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('freelancer')
export class FreelancerController {
  constructor(private readonly freelancerService: FreelancerService) { }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.freelancerService.findAll();
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.freelancerService.findOne(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get("/findUserBySkillAndSalary")
  async findUserBySkillAndSalary(@Query("skill") skill: string, @Query("min-salary") minsalary: number, @Query("max-salary") maxsalary: number, @Res() res: Response) {
    console.log({ skill, minsalary, maxsalary });

    try {
      const data = await this.freelancerService.findUserBySkillAndSalary({ skill, minsalary, maxsalary });
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Res() res: Response, @Body() updateFreelancerDto: UpdateFreelancerDto) {
    try {
      const data = await this.freelancerService.update(+id, updateFreelancerDto);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.freelancerService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }
}
