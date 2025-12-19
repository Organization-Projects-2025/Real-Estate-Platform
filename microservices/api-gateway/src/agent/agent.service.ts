/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AgentService {
  constructor(
    @Inject('AGENT_SERVICE') private readonly agentClient: ClientProxy,
  ) {}

  async create(agentData: any): Promise<any> {
    return firstValueFrom(this.agentClient.send({ cmd: 'createAgent' }, agentData));
  }

  async findAll(): Promise<any> {
    return firstValueFrom(this.agentClient.send({ cmd: 'getAllAgents' }, {}));
  }

  async findById(id: string): Promise<any> {
    return firstValueFrom(this.agentClient.send({ cmd: 'getAgentById' }, id));
  }

  async update(id: string, updateData: any): Promise<any> {
    return firstValueFrom(this.agentClient.send({ cmd: 'updateAgent' }, { id, updateData }));
  }

  async delete(id: string): Promise<any> {
    return firstValueFrom(this.agentClient.send({ cmd: 'deleteAgent' }, id));
  }

  async getPhoneNumber(id: string): Promise<any> {
    return firstValueFrom(this.agentClient.send({ cmd: 'getAgentPhoneNumber' }, id));
  }

  async findByEmail(email: string): Promise<any> {
    return firstValueFrom(this.agentClient.send({ cmd: 'getAgentByEmail' }, email));
  }
}
