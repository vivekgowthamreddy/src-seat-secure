import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async list() {
    const users = await this.usersService.findAll();
    return users.map((u: any) => ({ id: u._id, email: u.email, name: u.name, role: u.role }));
  }
}
