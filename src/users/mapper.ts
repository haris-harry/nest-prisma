import { UserDto } from '../auth/user.dto';

export const toUserDto = (data: any): UserDto => {
    const { id, email } = data;
  
    let userDto: UserDto = {
      id,
      email,
    };
  
    return userDto;
  };
  