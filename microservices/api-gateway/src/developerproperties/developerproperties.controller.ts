/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DeveloperPropertiesService } from './developerproperties.service';

@Controller()
export class DeveloperPropertiesController {
  constructor(private readonly service: DeveloperPropertiesService) {}

  // Developer endpoints
  @Post('developers')
  async createDeveloper(@Body() data: any) {
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
  async updateProperty(@Param('id') id: string, @Body() data: any) {
    return this.service.updateProperty(id, data);
  }

  @Delete('developer-properties/:id')
  async deleteProperty(@Param('id') id: string) {
    return this.service.deleteProperty(id);
  }
}
