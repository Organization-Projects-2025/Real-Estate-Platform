/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async create(@Body() agentData: any) {
    return this.agentService.create(agentData);
  }

  @Get()
  async findAll() {
    return this.agentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.agentService.findById(id);
  }

  @Get(':id/phone')
  async getPhoneNumber(@Param('id') id: string) {
    return this.agentService.getPhoneNumber(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.agentService.findByEmail(email);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.agentService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.agentService.delete(id);
  }
}
