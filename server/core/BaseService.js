class BaseService {
  constructor() {}

  async execute(action, data) {
    try {
      return await this.perform(action, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async perform(action, data) {
    throw new Error('Method not implemented');
  }

  handleError(error) {
    throw error;
  }
}

module.exports = BaseService;
