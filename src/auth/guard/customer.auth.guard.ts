import { AuthGuard } from '@nestjs/passport';

export class OwnerGuards extends AuthGuard('customer') {
  //AuthGuard('admin') here admin is refering to the strategy of 'admin'
  //the name of the parameter should be same in jwt.strategy and guard
  constructor() {
    super();
    console.log('2');
  }
}
