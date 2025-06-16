import { BaseModel } from './base.model';
import { UserModel } from './user.model';

export class ParentModel extends BaseModel {
  name: string = '';
  lastName: string = '';
  addressLine1: string = '';
  addressLine2?: string;
  houseNumber: string = '';
  zipCode: string = '';
  neighborhood: string = '';
  state: string = '';
  user?: UserModel;
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
