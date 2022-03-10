import { Controller, Post, Body, Get, Param, Patch, Put, Delete, UseGuards, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./updateUser..dto";
import { CreateUserDto } from './createUser.dto';
import { FindOneParams } from '../utils/findOneParams';
import { AuthGuard } from '@nestjs/passport';
import { PlanDetailsDto } from "./planDetails.dto";


@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard())
    async getUsers() {
      return this.usersService.getUsers();
    }
   
  
   
    @Post()
    async createUser(@Body() user: CreateUserDto) {
      return this.usersService.createUser(user);
    }

    @Post('subscribe')
    @UseGuards(AuthGuard())
    async subscribeToPlan(@Body() planDetails: PlanDetailsDto, @Req() req: any){
      return this.usersService.subscribeToPlan(planDetails, req.user)
    }

    @Post('cancelMembership')
    @UseGuards(AuthGuard())
    async cancelMembership(@Req() req: any){
      return this.usersService.cancelPlanMembership(req.user)
    }
   
    @Put(':id')
    @UseGuards(AuthGuard())
    async updateUser(
      @Param() { id }: FindOneParams,
      @Body() user: UpdateUserDto,
    ) {
      return this.usersService.updateUser(Number(id), user);
    }
   
    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteUser(@Param() { id }: FindOneParams) {
      return this.usersService.deleteUser(Number(id));
    }

}