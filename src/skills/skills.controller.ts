import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpCode, UseGuards, Request } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Role } from 'src/user/role/role.enum';
import { HasRoles } from 'src/auth/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags("Skills*")
@Controller('skills')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description:""})
  @Post()
  async create(@Body() createSkillDto: CreateSkillDto, @Res() res: Response, @Request() req) {
    try {
      if (req.user.role == 0) {
        const data = await this.skillsService.create(createSkillDto);
        return res.status(HttpStatus.OK).json(data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'you do not have access' })
      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:""})
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await this.skillsService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:""})
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.skillsService.findOne(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:""})
  @HasRoles(Role.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto, @Res() res: Response, @Request() req) {
    try {
      if (req.user.role == 0) {
        const data = await this.skillsService.update(+id, updateSkillDto);
        return res.status(HttpStatus.OK).json(data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'you do not have access' })
      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description:""})
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response, @Request() req) {
    try {
      if (req.user.role == 0) {
        const data = await this.skillsService.remove(+id);
        return res.status(HttpStatus.OK).json(data);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: 'you do not have access' })
      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }
}
