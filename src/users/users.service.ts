import { Injectable, NotFoundException, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from '../prisma.service';
import { UserNotFoundException } from '../exceptions/userNotFoundException';
import { CreateUserDto } from './createUser.dto';
import { UpdateUserDto } from "./updateUser..dto";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaError } from '../utils/prismaError';
import { UserDto } from '../auth/user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "src/auth/user-login.dto";
import { toUserDto } from "./mapper";
import { PlanDetailsDto } from "./planDetails.dto";
import * as moment from 'moment';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51KbfSBGiXE7S2N6WUknBghraFY3YOmssyT2GR3RVtkKmhnd1nTJ9L1Fer7y4hF812C8zBhh7OXLdnRDmAgqSNBLr00OeuhGvKw', {
    apiVersion: '2020-08-27',
});


@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }

    async getUsers() {
        return this.prismaService.user.findMany();
    }

    // for jwt token verification
    async findByPayload({ email }: any): Promise<any> {
        return await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });
    }

    // login user
    async findByLogin({ email, password }: LoginUserDto): Promise<UserDto> {
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        // compare passwords
        const areEqual = await bcrypt.compare(password, user.password);

        if (!areEqual) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return toUserDto(user);
    }

    async createUser(user: CreateUserDto) {
        let userPass = user.password
        let hashedPass = await bcrypt.hash(userPass, 10)
        user.password = hashedPass;
        return this.prismaService.user.create({
            data: user,
        });
    }

    async subscribeToPlan(planDetails: PlanDetailsDto, user: any) {
        try {

            let oneMonthFromNow = moment().add(1, 'M')

            if (planDetails.runningPlan == 'Plan A') {

                const charge = await stripe.charges.create({
                    amount: 2000,
                    currency: 'usd',
                    source: user.stipeSourceId,
                    customer: user.stripeCustomerId,
                    description: `charge for ${planDetails.runningPlan}`,
                })

            } else if (planDetails.runningPlan == 'Plan B') {

                const charge = await stripe.charges.create({
                    amount: 1000,
                    currency: 'usd',
                    source: user.stipeSourceId,
                    customer: user.stripeCustomerId,
                    description: `charge for ${planDetails.runningPlan}`,
                })
            }

            await this.prismaService.user.update({
                data: { runningPlan: planDetails.runningPlan, planStartDate: moment().add(0, 'M').toISOString() },
                where: { id: user.id }
            })
            return { status: true, message: `${planDetails.runningPlan} subscribed. expiry date: ${oneMonthFromNow}` }
        } catch (error) {
            throw error
        }
    }

    async cancelPlanMembership(user: any) {
        try {
            await this.prismaService.user.update({
                data: { runningPlan: '' },
                where: { id: user.id }
            })
            return { status: true, message: `plan unsubscribed.` }
        } catch (error) {
            throw error
        }
    }



    async updateUser(id: number, user: UpdateUserDto) {
        try {
            return await this.prismaService.user.update({
                data: {
                    ...user,
                    id: undefined,
                },
                where: {
                    id,
                },
            });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === PrismaError.RecordDoesNotExist
            ) {
                throw new UserNotFoundException(id);
            }
            throw error;
        }
    }

    async deleteUser(id: number) {
        try {
            return this.prismaService.user.delete({
                where: {
                    id,
                },
            });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === PrismaError.RecordDoesNotExist
            ) {
                throw new UserNotFoundException(id);
            }
            throw error;
        }
    }

}