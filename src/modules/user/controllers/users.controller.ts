import { Controller, Delete, Get, Inject, Put } from '@/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthService } from '@/modules/auth/services/auth.service';
import { Request } from 'express';
import ValidatorMiddleware from '@/middlewares/validator.middleware';
import UpdateUserDTO, { InferUpdateUserDTO } from '../dtos/update-user.dto';
import { Middleware } from '@/core/decorators/middleware.decorator';
import { BadParametersError } from '../errors/bad-parameter.error';
@Controller('/users')
export default class UsersController {
  constructor(
    @Inject('UserService') private readonly userService: UserService,
    @Inject('AuthService') private readonly authService: AuthService
  ) {}

  @Get('/:idOrEmail')
  async getUser(req: Request): Promise<User> {
    await this.authService.guardUserIsAuthenticated(req);

    const idOrEmail = req.params['idOrEmail'];
    return await this.userService.findUserByIdOrEmail(idOrEmail);
  }

  @Put('/:id')
  @Middleware(ValidatorMiddleware(UpdateUserDTO))
  async updateUser(req: Request): Promise<User> {
    await this.authService.guardUserIsAuthenticated(req);
    await this.userService.guardUserExistById(parseInt(req.params['id']));

    const body = req.body as InferUpdateUserDTO;

    if (body === null || Object.keys(body).length === 0) {
      throw new BadParametersError();
    }

    return await this.userService.updateUser(parseInt(req.params['id']), body);
  }

  @Delete('/:id')
  async deleteUser(req: Request): Promise<{ msg: string }> {
    await this.authService.guardUserIsAuthenticated(req);
    await this.userService.guardUserExistById(parseInt(req.params['id']));

    await this.userService.deleteUserById(parseInt(req.params['id']));

    return { msg: `Successfully deleted record number : ${req.params['id']}` };
  }
}
