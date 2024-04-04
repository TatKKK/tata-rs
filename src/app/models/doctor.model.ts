import { User } from "./user.model";
import { UserDto} from "./user.model";
import { Experience } from "./experience.model";

export class Doctor extends User {
  public Category?: string;
  public Score?: number;
  public ViewCount?:number;
  public Experiences?: Experience[];
  public CvUrl?:string

  constructor(
    Id: number | null,
    Fname: string,
    Lname: string,
    IdNumber: string,
    Email: string,
    Password?: string,
    Discriminator?: string,
    Category?: string,
    Score?: number,
    ViewCount?:number,
    ImageUrl?: string,
    Experiences?: Experience[],
    CvUrl?:string
  ) {
    super(Id, Fname, Lname, IdNumber, Email, Password, Discriminator, ImageUrl);
    this.Category = Category;
    this.Score = Score;
    this.ViewCount=ViewCount;
       this.Experiences = Experiences || [];
    this.CvUrl=CvUrl
  }

}

export class DoctorDto extends UserDto {
  public category?: string;
  public cv:File
  
  constructor(
    id: number | null,
    fname: string | null,
    lname: string| null,
    idNumber: string| null,
    email: string| null,
    password: string| null,
    discriminator: string,
    category: string,
    cv: File,
    image?: File    
  ) {
    super(id, fname, lname, idNumber, email, password, discriminator, image);
    this.category = category;
    this.cv = cv;
  }
}