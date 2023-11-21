import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { CustomerService } from './customer.service';

@ApiTags("Customer*")
@Controller('customer')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({description:"վերադարձնում է բոլոր այն մարդկանց տվյալները, ովքեր գրանցվել են որպես customer "})
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const data = await  this.customerService.findAll();
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiResponse({description:"վերադարձնում է customer-ի տվյալը ըստ իր id-ի"})
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await  this.customerService.findOne(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({description:"հնարավորություն է տալիս ջնջել customer-ի տվյալները"})
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.customerService.remove(+id);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e.message })
    }
  }
}
