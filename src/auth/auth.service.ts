import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../users/createUser.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { UsersService } from '../users/users.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from './user-login.dto';
import { UserDto } from './user.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { toUserDto } from 'src/users/mapper';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51KbfSBGiXE7S2N6WUknBghraFY3YOmssyT2GR3RVtkKmhnd1nTJ9L1Fer7y4hF812C8zBhh7OXLdnRDmAgqSNBLr00OeuhGvKw', {
  apiVersion: '2020-08-27',
});

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) { }

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      //   await this.usersService.createUser(userDto);
      let userPass = userDto.password
      let hashedPass = await bcrypt.hash(userPass, 10)
      userDto.password = hashedPass;

        const customer = await stripe.customers.create({
          description: 'My First Test Customer (created for API docs)',
          email: userDto.email,
          name: userDto.name
        });



        const card = await stripe.customers.createSource(
          customer.id,
          {
            source: 'tok_visa',
            // card: {
            //     number: '4000056655665556',
            //     cvc: 123,
            //     exp_year: 2025,
            //     exp_month: 12
            // }
          }
        );
        console.log(card.id)      


      delete userDto.cardNumber
      delete userDto.cvc
      delete userDto.expiryDate
      userDto.stipeSourceId = card.id
      userDto.stripeCustomerId = customer.id
      await this.prismaService.user.create({ data: userDto })
    } catch (err) {
      console.log(err)
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }


  async login({ email, password }: LoginUserDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await bcrypt.compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // generate and sign token
    const token = this._createToken(toUserDto(user));

    return {
      email: user.email,
      ...token,
    };
  }


  async validateUser({ email }: JwtPayload): Promise<any> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    return user;
  }



  private _createToken({ email }: UserDto): any {
    const expiresIn = process.env.EXPIRESIN;

    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }

}
