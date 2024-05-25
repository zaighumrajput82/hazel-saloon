import { AuthGuard } from '@nestjs/passport';

export class SuperAdminGuards extends AuthGuard('admin') {
  //AuthGuard('admin') here admin is refering to the strategy of 'admin'
  //the name of the parameter should be same in jwt.strategy and guard
  constructor() {
    console.log('3');
    super();
  }
}
