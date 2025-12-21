/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { DeveloperPropertiesService } from './developerproperties.service';
import { AdminGuard, AuthGuard, DeveloperGuard } from '../auth/auth.guard';

@Controller()
export class DeveloperPropertiesController {
  constructor(private readonly service: DeveloperPropertiesService) {}

  // Developer endpoints
  @Post('developers')
  @UseGuards(AdminGuard)
  async createDeveloper(@Body() data: any, @Req() req: Request) {
    // Only admin can create developers
    return this.service.createDeveloper(data);
  }

  @Get('developers')
  async getAllDevelopers() {
    return this.service.getAllDevelopers();
  }

  @Get('developers/:id')
  async getDeveloperById(@Param('id') id: string) {
    return this.service.getDeveloperById(id);
  }

  @Put('developers/:id')
  async updateDeveloper(@Param('id') id: string, @Body() data: any) {
    return this.service.updateDeveloper(id, data);
  }

  @Delete('developers/:id')
  async deleteDeveloper(@Param('id') id: string) {
    return this.service.deleteDeveloper(id);
  }

  // Developer Property endpoints
  @Post('developer-properties')
  async createProperty(@Body() data: any) {
    return this.service.createProperty(data);
  }

  @Get('developer-properties')
  async getAllProperties() {
    return this.service.getAllProperties();
  }

  @Get('developer-properties/developer/:developerId')
  async getPropertiesByDeveloper(@Param('developerId') developerId: string) {
    return this.service.getPropertiesByDeveloper(developerId);
  }

  @Get('developer-properties/:id')
  async getPropertyById(@Param('id') id: string) {
    return this.service.getPropertyById(id);
  }

  @Put('developer-properties/:id')
  @UseGuards(AuthGuard)
  async updateProperty(@Param('id') id: string, @Body() data: any, @Req() req: Request) {
    // Developer can only edit their own properties
    return this.service.updateProperty(id, data, req.user?.id);
  }

  @Delete('developer-properties/:id')
  @UseGuards(AuthGuard)
  async deleteProperty(@Param('id') id: string, @Req() req: Request) {
    // Developer can only delete their own properties
    return this.service.deleteProperty(id, req.user?.id);
  }
}
