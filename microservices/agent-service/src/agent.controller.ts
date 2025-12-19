/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AgentService } from './agent.service';

@Controller()
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @MessagePattern({ cmd: 'createAgent' })
  async create(@Payload() agentData: any) {
    return this.agentService.create(agentData);
  }

  @MessagePattern({ cmd: 'getAllAgents' })
  async findAll() {
    return this.agentService.findAll();
  }

  @MessagePattern({ cmd: 'getAgentById' })
  async findOne(@Payload() id: string) {
    return this.agentService.findById(id);
  }

  @MessagePattern({ cmd: 'updateAgent' })
  async update(@Payload() data: { id: string; updateData: any }) {
    return this.agentService.update(data.id, data.updateData);
  }

  @MessagePattern({ cmd: 'deleteAgent' })
  async remove(@Payload() id: string) {
    return this.agentService.delete(id);
  }

  @MessagePattern({ cmd: 'getAgentPhoneNumber' })
  async getPhoneNumber(@Payload() id: string) {
    return this.agentService.getPhoneNumber(id);
  }

  @MessagePattern({ cmd: 'getAgentByEmail' })
  async findByEmail(@Payload() email: string) {
    return this.agentService.findByEmail(email);
  }
}
