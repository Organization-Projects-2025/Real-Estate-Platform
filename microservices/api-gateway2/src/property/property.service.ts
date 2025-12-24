/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PropertyService {
  constructor(
    @Inject('PROPERTY_SERVICE') private readonly propertyClient: ClientProxy,
  ) {}

  async create(propertyData: any): Promise<any> {
    return firstValueFrom(this.propertyClient.send({ cmd: 'createProperty' }, propertyData));
  }

  async findAll(): Promise<any> {
    return firstValueFrom(this.propertyClient.send({ cmd: 'getAllProperties' }, {}));
  }

  async findById(id: string): Promise<any> {
    return firstValueFrom(this.propertyClient.send({ cmd: 'getPropertyById' }, id));
  }

  async update(id: string, updateData: any): Promise<any> {
    return firstValueFrom(this.propertyClient.send({ cmd: 'updateProperty' }, { id, updateData }));
  }

  async delete(id: string): Promise<any> {
    return firstValueFrom(this.propertyClient.send({ cmd: 'deleteProperty' }, id));
  }

  async findByUser(userId: string): Promise<any> {
    return firstValueFrom(this.propertyClient.send({ cmd: 'getPropertiesByUser' }, userId));
  }

  async findByListingType(listingType: string): Promise<any> {
    return firstValueFrom(this.propertyClient.send({ cmd: 'getPropertiesByListingType' }, listingType));
  }

  async search(filters: any): Promise<any> {
    return firstValueFrom(this.propertyClient.send({ cmd: 'searchProperties' }, filters));
  }

  async getFeatured(limit: number): Promise<any> {
    return firstValueFrom(this.propertyClient.send({ cmd: 'getFeaturedProperties' }, limit));
  }
}
