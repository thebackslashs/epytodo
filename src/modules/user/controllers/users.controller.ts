import { Controller, Delete, Get, Inject, Put } from '@/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { Request } from 'express';
import ValidatorMiddleware from '@/middlewares/validator.middleware';
import UpdateUserDTO, { InferUpdateUserDTO } from '../dtos/update-user.dto';
import { Middleware } from '@/core/decorators/middleware.decorator';

@Controller('/users')
export default class UsersController {
  constructor(
    @Inject('UserService') private readonly userService: UserService,
    @Inject('AuthGuard') private readonly authGuard: AuthGuard
  ) {}

  @Get('/:idOrEmail')
  async getUser(req: Request): Promise<User> {
    await this.authGuard.guardUserIsAuthenticated(req);

    const idOrEmail = req.params['idOrEmail'];

    return await this.userService.findUserByIdOrEmail(idOrEmail);
  }

  @Put('/:id')
  @Middleware(ValidatorMiddleware(UpdateUserDTO))
  async updateUser(req: Request): Promise<User> {
    await this.authGuard.guardUserCanModifyUserRessource(
      req,
      parseInt(req.params['id'])
    );

    const body = req.body as InferUpdateUserDTO;
    const id = parseInt(req.params['id']);

    return await this.userService.updateUser(id, body);
  }

  @Delete('/:id')
  async deleteUser(req: Request): Promise<{ msg: string }> {
    await this.authGuard.guardUserCanModifyUserRessource(
      req,
      parseInt(req.params['id'])
    );

    const id = parseInt(req.params['id']);

    await this.userService.deleteUserById(id);

    return { msg: `Successfully deleted record number: ${id.toString()}` };
  }
}
