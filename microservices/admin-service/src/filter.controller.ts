/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FilterService } from './filter.service';
import { CreateFilterDto, UpdateFilterDto } from './filter.dto';

@Controller()
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @MessagePattern({ cmd: 'createFilter' })
  async create(@Payload() createFilterDto: CreateFilterDto) {
    return this.filterService.create(createFilterDto);
  }

  @MessagePattern({ cmd: 'getAllFilters' })
  async findAll(@Payload() payload?: { category?: string }) {
    return this.filterService.findAll(payload?.category);
  }

  @MessagePattern({ cmd: 'getFilterById' })
  async findOne(@Payload() id: string) {
    return this.filterService.findById(id);
  }

  @MessagePattern({ cmd: 'updateFilter' })
  async update(@Payload() data: { id: string; updateFilterDto: UpdateFilterDto }) {
    return this.filterService.update(data.id, data.updateFilterDto);
  }

  @MessagePattern({ cmd: 'deleteFilter' })
  async remove(@Payload() id: string) {
    return this.filterService.delete(id);
  }

  @MessagePattern({ cmd: 'getFiltersByCategory' })
  async findByCategory(@Payload() category: string) {
    return this.filterService.findByCategory(category);
  }

  @MessagePattern({ cmd: 'deleteCategoryFilters' })
  async deleteByCategory(@Payload() category: string) {
    return this.filterService.deleteByCategory(category);
  }
}
