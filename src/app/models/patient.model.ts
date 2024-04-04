import { User } from "./user.model";
import { UserDto } from "./user.model";


export class Patient extends User{
}

export class PatientDto extends UserDto {
    // Code?: string;  
  }

export class ActivationCodeRequest {
    UserEmail?: string;
    // Code?: string;
  }
 export class VerifyCodeRequest{
  UserEmail?:string;
  ActivationCode_?:string;
 }
export class ActivationCode {
    CodeId?: number;
    UserEmail?: string;
    ActivationCode_?: string;
    GeneratedTime?: Date;
    ExpirationTime?: Date;
    IsValid?: boolean;
  }