import { UserDto } from '../user.dto';

export interface LoginStatus {
  email: string;
  accessToken: any;
  expiresIn: any;
}
