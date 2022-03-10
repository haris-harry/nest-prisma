import { NotFoundException } from '@nestjs/common';
 
export class UserNotFoundException extends NotFoundException {
  constructor(userId: number) {
    super(`user with id ${userId} not found`);
  }
}