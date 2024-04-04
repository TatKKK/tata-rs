export class User {
  constructor(
    public Id?: number | null,
    public Fname?: string | null,
    public Lname?: string | null,
    public IdNumber?: string | null,
    public Email?: string | null,
    public Password?: string | null,
    public Discriminator?: string,
    public ImageUrl?:string|null
  ){}
}

export class UserDto {
  constructor(
    public id?: number | null,
    public fname?: string | null,
    public lname?: string | null,
    public idNumber?: string | null,
    public email?: string | null,
    public password?: string | null,
    public discriminator?: string,
    public image?: File  
  ) {}
}

export class Login{
  constructor(public email?: string,
              public password?: string){
}
}