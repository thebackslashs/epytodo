import { Controller, Inject, Post } from '@/core';
import AuthService from '../services/auth.service';
import { Middleware } from '@/core/decorators/middleware.decorator';
import LoginDTO, { InferLoginDTO } from '../dtos/login.dto';
import ValidatorMiddleware from '@/middlewares/validator.middleware';
import RegisterDTO, { InferRegisterDTO } from '../dtos/register.dto';

@Controller('/')
export default class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService
  ) {}

  @Post('/login')
  @Middleware(ValidatorMiddleware(LoginDTO))
  async login(req: Request): Promise<{ msg: string } | { token: string }> {
    const credentials = req.body as unknown as InferLoginDTO;
    const { token } = await this.authService.login(
      credentials.email,
      credentials.password
    );
    return { token };
  }

  @Post('/register', 201)
  @Middleware(ValidatorMiddleware(RegisterDTO))
  async register(req: Request): Promise<{ msg: string } | { token: string }> {
    const user = req.body as unknown as InferRegisterDTO;
    const { token } = await this.authService.register(user);
    return { token };
  }
}
