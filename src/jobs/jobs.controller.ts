import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Res, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto, UpdateJobStatus } from './dto/update-job.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { Role } from 'src/user/role/role.enum';
import { Response } from 'express';

@ApiTags("Jobs*")
@Controller('jobs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.CUSTOMER)
  @ApiResponse({ description: "customer—ին հնարավորություն է տալիս նոր job ավելացնել, որտեղ skills-ը փոխանցում է որպես number[ ]" })
  @Post()
  async create(@Body() createJobDto: CreateJobDto, @Res() res: Response, @Request() req) {
    try {
      if (req.user.role == Role.CUSTOMER) {
        const data = await this.jobsService.create({ ...createJobDto, customerId: req.user.customer[0].id });
        return res.status(HttpStatus.OK).json(data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Oops! you do not have access' })
      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել բոլոր job—երը" })
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.jobsService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել job—ի տվյալները ըստ jobId-ի" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.jobsService.findOne(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել job—ի տվյալները ըստ status-ի" })
  @Get('findJobsByStatus/:status')
  async findJobsByStatus(@Param('status') status: string, @Res() res: Response) {
    try {
      const data = await this.jobsService.findJobsByStatus(+status);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել job—ի տվյալները ըստ freelancerId-ի" })
  @Get('findJobsByFreelancerId/:id')
  async findJobsByFreelancerId(@Param('id') status: string, @Res() res: Response) {
    try {
      const data = await this.jobsService.findJobsByFreelancerId(+status);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել job—ի տվյալները ըստ customerId-ի" })
  @Get('findJobsByCustomerId/:id')
  async findJobsByCustomerId(@Param('id') status: string, @Res() res: Response) {
    try {
      const data = await this.jobsService.findJobsByCustomerId(+status);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "customer—ին հնարավորություն է տալիս թարմացնել job-ի տվյալները -> title, description, price" })
  @HasRoles(Role.CUSTOMER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Res() res: Response, @Request() req) {
    try {
      if (req.user.role == Role.CUSTOMER) {
        const data = await this.jobsService.update(+id, updateJobDto);
        return res.status(HttpStatus.OK).json(data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Oops! you don't have any access" })

      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "customer—ին հնարավորություն է տալիս թարմացնել job-ի status-ը " })
  @HasRoles(Role.CUSTOMER)
  @Patch('updateJobStatus/:id')
  async updateJobStatus(@Param('id') id: string, @Body() updateJobDto: UpdateJobStatus, @Res() res: Response, @Request() req) {
    try {
      if (req.user.role == Role.CUSTOMER) {
        const data = await this.jobsService.updateJobStatus(+id, updateJobDto);
        return res.status(HttpStatus.OK).json(data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error:"Oops! you don't have any access" })

      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "customer—ին հնարավորություն է տալիս job-ի համար հաստատել freelancer-ին" })
  @HasRoles(Role.CUSTOMER)
  @Patch('saveFreelancer/:jobId/:freelancerId')
  async saveFreelancer(@Param('jobId') jobId: number, @Param('freelancerId') freelancerId: number, @Res() res: Response, @Request() req) {
    try {
      if (req.user.role == Role.CUSTOMER) {
        const data = await this.jobsService.saveFreelancer({ jobId, freelancerId });
        return res.status(HttpStatus.OK).json(data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Oops! you don't have any access" })
      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "customer—ին հնարավորություն է տալիս ջնջել job-ը" })
  @HasRoles(Role.CUSTOMER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response, @Request() req) {
    try {
      if (req.user.role == Role.CUSTOMER) {
        const data = await this.jobsService.remove(+id);
        return res.status(HttpStatus.OK).json(data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Oops! you don't have any access"})
      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }
}