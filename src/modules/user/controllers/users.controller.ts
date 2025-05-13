import { Controller, Delete, Get, Inject, Put } from '@/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthService } from '@/modules/auth/services/auth.service';
import { UserNotFoundError } from '../errors/user-not-found.error';
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
    if (isNaN(parseInt(idOrEmail))) {
      const user = await this.userService.findUsers({ email: idOrEmail });
      if (user.length === 0) {
        throw new UserNotFoundError();
      }
      return user[0];
    }

    const user = await this.userService.findUsers({ id: parseInt(idOrEmail) });
    if (user.length === 0) {
      throw new UserNotFoundError();
    }

    return user[0];
  }

  @Put('/:id')
  @Middleware(ValidatorMiddleware(UpdateUserDTO))
  async updateUser(req: Request): Promise<User> {
    await this.authService.guardUserIsAuthenticated(req);

    const id = req.params['id'];
    if (isNaN(parseInt(id))) {
      throw new UserNotFoundError();
    }

    const user = await this.userService.findUsers({ id: parseInt(id) });
    if (user.length === 0) {
      throw new UserNotFoundError();
    }

    const body = req.body as InferUpdateUserDTO;

    if (body === null || Object.keys(body).length === 0) {
      throw new BadParametersError();
    }

    const payload: Omit<User, 'id' | 'created_at'> = {
      name: body.name ?? user[0].name,
      email: body.email ?? user[0].email,
      password: body.password
        ? await this.authService.hashPassword(body.password)
        : user[0].password,
      firstname: body.firstname ?? user[0].firstname,
    };

    await this.userService.updateUser(parseInt(id), payload);

    return {
      ...payload,
      id: parseInt(id),
      created_at: user[0].created_at,
    };
  }

  @Delete('/:id')
  async deleteUser(req: Request): Promise<{ msg: string }> {
    await this.authService.guardUserIsAuthenticated(req);

    const id = req.params['id'];
    if (isNaN(parseInt(id))) {
      throw new UserNotFoundError();
    }

    const user = await this.userService.findUsers({ id: parseInt(id) });
    if (user.length === 0) {
      throw new UserNotFoundError();
    }

    await this.userService.deleteUser({ id: parseInt(id) });

    return { msg: `Successfully deleted record number : ${id}` };
  }
}
