/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeveloperPropertiesService {
  constructor(
    @Inject('DEVELOPERPROPERTIES_SERVICE') private client: ClientProxy,
  ) {}

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
}
