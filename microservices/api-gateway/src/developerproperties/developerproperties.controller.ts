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

  @Get('developer-properties/user/:userId')
  async getPropertiesByUser(@Param('userId') userId: string) {
    return this.service.getPropertiesByUser(userId);
  }

  @Get('developer-properties/project/:projectId')
  async getPropertiesByProject(@Param('projectId') projectId: string) {
    return this.service.getPropertiesByProject(projectId);
  }

  @Post('developer-properties/user/:userId')
  async createPropertyForUser(@Param('userId') userId: string, @Body() data: any) {
    return this.service.createPropertyForUser(userId, data);
  }

  @Post('developer-properties/project/:userId/:projectId')
  async createPropertyForProject(@Param('userId') userId: string, @Param('projectId') projectId: string, @Body() data: any) {
    return this.service.createPropertyForProject(userId, projectId, data);
  }

  @Put('developer-properties/user/:userId/:propertyId')
  async updatePropertyForUser(@Param('userId') userId: string, @Param('propertyId') propertyId: string, @Body() data: any) {
    return this.service.updatePropertyForUser(userId, propertyId, data);
  }

  @Delete('developer-properties/user/:userId/:propertyId')
  async deletePropertyForUser(@Param('userId') userId: string, @Param('propertyId') propertyId: string) {
    return this.service.deletePropertyForUser(userId, propertyId);
  }

  // Project endpoints
  @Post('projects')
  async createProject(@Body() data: any) {
    return this.service.createProject(data);
  }

  @Get('projects')
  async getAllProjects() {
    return this.service.getAllProjects();
  }

  @Get('projects/:id')
  async getProjectById(@Param('id') id: string) {
    return this.service.getProjectById(id);
  }

  @Get('projects/user/:userId')
  async getProjectsByUser(@Param('userId') userId: string) {
    return this.service.getProjectsByUser(userId);
  }

  @Put('projects/:id')
  async updateProject(@Param('id') id: string, @Body() data: any) {
    return this.service.updateProject(id, data);
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    return this.service.deleteProject(id);
  }

  @Put('projects/user/:userId/:projectId')
  async updateProjectForUser(@Param('userId') userId: string, @Param('projectId') projectId: string, @Body() data: any) {
    return this.service.updateProjectForUser(userId, projectId, data);
  }

  @Delete('projects/user/:userId/:projectId')
  async deleteProjectForUser(@Param('userId') userId: string, @Param('projectId') projectId: string) {
    return this.service.deleteProjectForUser(userId, projectId);
  }

  @Post('projects/user/:userId')
  async createProjectForUser(@Param('userId') userId: string, @Body() data: any) {
    return this.service.createProjectForUser(userId, data);
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
