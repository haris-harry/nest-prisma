import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule{}