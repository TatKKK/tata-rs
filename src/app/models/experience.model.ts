export class Experience {
    constructor(
      public ExperienceId: number,
      public DoctorId: number,
      public CompanyName: string,
      public Role: string,
      public StartDate: Date,
      public EndDate?: Date,
      public Description?: string
    ) { }
  }
  