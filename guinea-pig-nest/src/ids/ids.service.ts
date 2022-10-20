import { Injectable } from '@nestjs/common';

@Injectable()
export class IdsService {
  private lastGeneratedId = 0;
  generateId(): number {
    this.lastGeneratedId += 1;
    return this.lastGeneratedId;
  }
}
