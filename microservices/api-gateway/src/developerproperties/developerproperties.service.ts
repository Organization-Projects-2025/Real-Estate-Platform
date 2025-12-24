/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeveloperPropertiesService {
  constructor(
    @Inject('DEVELOPERPROPERTIES_SERVICE') private client: ClientProxy,
  ) { }

  async createDeveloper(data: any) {
    return firstValueFrom(this.client.send({ cmd: 'createDeveloper' }, data));
  }

  async getAllDevelopers() {
    return firstValueFrom(this.client.send({ cmd: 'getAllDevelopers' }, {}));
  }

  async getDeveloperById(id: string) {
    return firstValueFrom(this.client.send({ cmd: 'getDeveloperById' }, id));
  }

  async updateDeveloper(id: string, data: any) {
    return firstValueFrom(this.client.send({ cmd: 'updateDeveloper' }, { id, updateData: data }));
  }

  async deleteDeveloper(id: string) {
    return firstValueFrom(this.client.send({ cmd: 'deleteDeveloper' }, id));
  }

  async createProperty(data: any) {
    return firstValueFrom(this.client.send({ cmd: 'createDeveloperProperty' }, data));
  }

  async getAllProperties() {
    return firstValueFrom(this.client.send({ cmd: 'getAllDeveloperProperties' }, {}));
  }

  async getPropertyById(id: string) {
    return firstValueFrom(this.client.send({ cmd: 'getDeveloperPropertyById' }, id));
  }

  async updateProperty(id: string, data: any, userId?: string) {
    return firstValueFrom(this.client.send({ cmd: 'updateDeveloperProperty' }, { id, updateData: data, userId }));
  }

  async deleteProperty(id: string, userId?: string) {
    return firstValueFrom(this.client.send({ cmd: 'deleteDeveloperProperty' }, { id, userId }));
  }

  async getPropertiesByDeveloper(developerId: string) {
    return firstValueFrom(this.client.send({ cmd: 'getPropertiesByDeveloper' }, developerId));
  }

  async getPropertiesByUser(userId: string) {
    return firstValueFrom(this.client.send({ cmd: 'getPropertiesByUser' }, userId));
  }

  async getPropertiesByProject(projectId: string) {
    return firstValueFrom(this.client.send({ cmd: 'getPropertiesByProject' }, projectId));
  }

  async createPropertyForUser(userId: string, propertyData: any) {
    return firstValueFrom(this.client.send({ cmd: 'createPropertyForUser' }, { userId, propertyData }));
  }

  async createPropertyForProject(userId: string, projectId: string, propertyData: any) {
    return firstValueFrom(this.client.send({ cmd: 'createPropertyForProject' }, { userId, projectId, propertyData }));
  }

  async updatePropertyForUser(userId: string, propertyId: string, updateData: any) {
    return firstValueFrom(this.client.send({ cmd: 'updatePropertyForUser' }, { userId, propertyId, updateData }));
  }

  async deletePropertyForUser(userId: string, propertyId: string) {
    return firstValueFrom(this.client.send({ cmd: 'deletePropertyForUser' }, { userId, propertyId }));
  }

  // Project methods
  async createProject(projectData: any) {
    return firstValueFrom(this.client.send({ cmd: 'createProject' }, projectData));
  }

  async getAllProjects() {
    return firstValueFrom(this.client.send({ cmd: 'getAllProjects' }, {}));
  }

  async getProjectById(id: string) {
    return firstValueFrom(this.client.send({ cmd: 'getProjectById' }, id));
  }

  async getProjectsByUser(userId: string) {
    return firstValueFrom(this.client.send({ cmd: 'getProjectsByUser' }, userId));
  }

  async updateProject(id: string, updateData: any) {
    return firstValueFrom(this.client.send({ cmd: 'updateProject' }, { id, updateData }));
  }

  async deleteProject(id: string) {
    return firstValueFrom(this.client.send({ cmd: 'deleteProject' }, id));
  }

  async updateProjectForUser(userId: string, projectId: string, updateData: any) {
    return firstValueFrom(this.client.send({ cmd: 'updateProjectForUser' }, { userId, projectId, updateData }));
  }

  async deleteProjectForUser(userId: string, projectId: string) {
    return firstValueFrom(this.client.send({ cmd: 'deleteProjectForUser' }, { userId, projectId }));
  }

  async createProjectForUser(userId: string, projectData: any) {
    return firstValueFrom(this.client.send({ cmd: 'createProjectForUser' }, { userId, projectData }));
  }

  async getProjectsWithPropertiesByDeveloper(developerId: string) {
    return firstValueFrom(this.client.send({ cmd: 'getProjectsWithPropertiesByDeveloper' }, developerId));
  }
}
