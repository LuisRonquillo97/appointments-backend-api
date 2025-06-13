// src/domain/model/parent.model.ts
import { States } from '../enums/states.enum';
import { UserModel } from './user.model';

export class ParentModel {
  id: number = 0;
  name: string = '';
  lastName: string = '';
  addressLine1: string = '';
  addressLine2?: string;
  houseNumber: string = '';
  zipCode: string = '';
  neighborhood: string = '';
  state: string = '';
  isActive: boolean = false;
  user?: UserModel;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date;
  deletedById?: number;

  // Domain logic methods
  getFullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  getFullAddress(): string {
    let address = this.addressLine1;

    if (this.houseNumber) {
      address += ` ${this.houseNumber}`;
    }

    if (this.addressLine2) {
      address += `, ${this.addressLine2}`;
    }

    address += `, ${this.neighborhood}, ${this.state}, ${this.zipCode}`;

    return address;
  }
}
