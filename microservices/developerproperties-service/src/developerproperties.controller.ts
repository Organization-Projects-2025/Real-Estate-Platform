/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeveloperPropertiesService } from './developerproperties.service';

@Controller()
export class DeveloperPropertiesController {
  constructor(private readonly service: DeveloperPropertiesService) {}

  // Developer endpoints
  @MessagePattern({ cmd: 'createDeveloper' })
  async createDeveloper(@Payload() data: any) {
    return this.service.createDeveloper(data);
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
  async updateProperty(@Payload() data: { id: string; updateData: any }) {
    return this.service.updateProperty(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'deleteDeveloperProperty' })
  async deleteProperty(@Payload() id: string) {
    return this.service.deleteProperty(id);
  }

  @MessagePattern({ cmd: 'getPropertiesByDeveloper' })
  async getPropertiesByDeveloper(@Payload() developerId: string) {
    return this.service.getPropertiesByDeveloper(developerId);
  }
}
