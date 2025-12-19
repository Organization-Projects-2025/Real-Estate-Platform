/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PropertyService } from './property.service';

@Controller()
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @MessagePattern({ cmd: 'createProperty' })
  async create(@Payload() propertyData: any) {
    return this.propertyService.create(propertyData);
  }

  @MessagePattern({ cmd: 'getAllProperties' })
  async findAll() {
    return this.propertyService.findAll();
  }

  @MessagePattern({ cmd: 'getPropertyById' })
  async findOne(@Payload() id: string) {
    return this.propertyService.findById(id);
  }

  @MessagePattern({ cmd: 'updateProperty' })
  async update(@Payload() data: { id: string; updateData: any }) {
    return this.propertyService.update(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'deleteProperty' })
  async remove(@Payload() id: string) {
    return this.propertyService.delete(id);
  }

  @MessagePattern({ cmd: 'getPropertiesByUser' })
  async findByUser(@Payload() userId: string) {
    return this.propertyService.findByUser(userId);
  }

  @MessagePattern({ cmd: 'getPropertiesByListingType' })
  async findByListingType(@Payload() listingType: string) {
    return this.propertyService.findByListingType(listingType);
  }

  @MessagePattern({ cmd: 'searchProperties' })
  async search(@Payload() filters: any) {
    return this.propertyService.search(filters);
  }

  @MessagePattern({ cmd: 'getFeaturedProperties' })
  async getFeatured(@Payload() limit: number) {
    return this.propertyService.getFeatured(limit);
  }
}
