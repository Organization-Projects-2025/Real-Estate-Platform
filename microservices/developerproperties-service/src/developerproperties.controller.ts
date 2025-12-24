/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeveloperPropertiesService } from './developerproperties.service';

@Controller()
export class DeveloperPropertiesController {
  constructor(private readonly service: DeveloperPropertiesService) { }

  // Project endpoints
  @MessagePattern({ cmd: 'createProject' })
  async createProject(@Payload() data: any) {
    return this.service.createProject(data);
  }

  @MessagePattern({ cmd: 'getAllProjects' })
  async getAllProjects() {
    return this.service.getAllProjects();
  }

  @MessagePattern({ cmd: 'getProjectById' })
  async getProjectById(@Payload() id: string) {
    return this.service.getProjectById(id);
  }

  @MessagePattern({ cmd: 'getProjectsByUser' })
  async getProjectsByUser(@Payload() userId: string) {
    return this.service.getProjectsByUser(userId);
  }

  @MessagePattern({ cmd: 'updateProject' })
  async updateProject(@Payload() data: { id: string; updateData: any }) {
    return this.service.updateProject(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'deleteProject' })
  async deleteProject(@Payload() id: string) {
    return this.service.deleteProject(id);
  }

  @MessagePattern({ cmd: 'updateProjectForUser' })
  async updateProjectForUser(@Payload() data: { userId: string; projectId: string; updateData: any }) {
    return this.service.updateProjectForUser(data.userId, data.projectId, data.updateData);
  }

  @MessagePattern({ cmd: 'deleteProjectForUser' })
  async deleteProjectForUser(@Payload() data: { userId: string; projectId: string }) {
    return this.service.deleteProjectForUser(data.userId, data.projectId);
  }

  @MessagePattern({ cmd: 'createProjectForUser' })
  async createProjectForUser(@Payload() data: { userId: string; projectData: any }) {
    return this.service.createProject({ ...data.projectData, developerId: data.userId });
  }

  @MessagePattern({ cmd: 'getAllDevelopers' })
  async getAllDevelopers() {
    return this.service.getAllDevelopers();
  }

  @MessagePattern({ cmd: 'getDeveloperById' })
  async getDeveloperById(@Payload() id: string) {
    return this.service.getDeveloperById(id);
  }

  @MessagePattern({ cmd: 'updateDeveloper' })
  async updateDeveloper(@Payload() data: { id: string; updateData: any }) {
    return this.service.updateDeveloper(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'deleteDeveloper' })
  async deleteDeveloper(@Payload() id: string) {
    return this.service.deleteDeveloper(id);
  }

  // Developer Property endpoints
  @MessagePattern({ cmd: 'createDeveloperProperty' })
  async createProperty(@Payload() data: any) {
    return this.service.createProperty(data);
  }

  @MessagePattern({ cmd: 'getAllDeveloperProperties' })
  async getAllProperties() {
    return this.service.getAllProperties();
  }

  @MessagePattern({ cmd: 'getDeveloperPropertyById' })
  async getPropertyById(@Payload() id: string) {
    return this.service.getPropertyById(id);
  }

  @MessagePattern({ cmd: 'updateDeveloperProperty' })
  async updateProperty(@Payload() data: { id: string; updateData: any; userId?: string }) {
    return this.service.updateProperty(data.id, data.updateData, data.userId);
  }

  @MessagePattern({ cmd: 'deleteDeveloperProperty' })
  async deleteProperty(@Payload() data: { id: string; userId?: string } | string) {
    // Support both old format (just id string) and new format (object with id and userId)
    if (typeof data === 'string') {
      return this.service.deleteProperty(data);
    }
    return this.service.deleteProperty(data.id, data.userId);
  }

  @MessagePattern({ cmd: 'getPropertiesByProject' })
  async getPropertiesByProject(@Payload() projectId: string) {
    return this.service.getPropertiesByProject(projectId);
  }

  @MessagePattern({ cmd: 'createPropertyForProject' })
  async createPropertyForProject(@Payload() data: { userId: string; projectId: string; propertyData: any }) {
    return this.service.createPropertyForProject(data.userId, data.projectId, data.propertyData);
  }

  @MessagePattern({ cmd: 'getPropertiesByUser' })
  async getPropertiesByUser(@Payload() userId: string) {
    return this.service.getPropertiesByUser(userId);
  }

  @MessagePattern({ cmd: 'createPropertyForUser' })
  async createPropertyForUser(@Payload() data: { userId: string; propertyData: any }) {
    return this.service.createPropertyForUser(data.userId, data.propertyData);
  }

  @MessagePattern({ cmd: 'updatePropertyForUser' })
  async updatePropertyForUser(@Payload() data: { userId: string; propertyId: string; updateData: any }) {
    return this.service.updatePropertyForUser(data.userId, data.propertyId, data.updateData);
  }

  @MessagePattern({ cmd: 'deletePropertyForUser' })
  async deletePropertyForUser(@Payload() data: { userId: string; propertyId: string }) {
    return this.service.deletePropertyForUser(data.userId, data.propertyId);
  }

  @MessagePattern({ cmd: 'getProjectsWithPropertiesByDeveloper' })
  async getProjectsWithPropertiesByDeveloper(@Payload() developerId: string) {
    return this.service.getProjectsWithPropertiesByDeveloper(developerId);
  }
}
