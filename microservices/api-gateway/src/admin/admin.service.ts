/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AdminService {
  constructor(@Inject('ADMIN_SERVICE') private client: ClientProxy) {}

  createFilter(createFilterDto: any) {
    return this.client.send({ cmd: 'createFilter' }, createFilterDto);
  }

  getAllFilters(category?: string) {
    // Nest microservices clientProxy.send does not allow null/undefined payloads.
    // Always send an object payload.
    return this.client.send(
      { cmd: 'getAllFilters' },
      { category: category ?? undefined },
    );
  }

  getFilterById(id: string) {
    return this.client.send({ cmd: 'getFilterById' }, id);
  }

  updateFilter(id: string, updateFilterDto: any) {
    return this.client.send(
      { cmd: 'updateFilter' },
      { id, updateFilterDto },
    );
  }

  deleteFilter(id: string) {
    return this.client.send({ cmd: 'deleteFilter' }, id);
  }

  getFiltersByCategory(category: string) {
    return this.client.send({ cmd: 'getFiltersByCategory' }, category);
  }

  deleteCategoryFilters(category: string) {
    return this.client.send({ cmd: 'deleteCategoryFilters' }, category);
  }
}
