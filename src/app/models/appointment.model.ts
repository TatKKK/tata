// export class Appointment {
//   id?: number;
//   doctorId?: number;
//   patientId?: number;    
//   startTime: Date;
//   notes?: string;
//   status?:boolean;

//   get endTime(): Date {
//     return new Date(this.startTime.getTime() + 60 * 60 * 1000); 
//   }

//   constructor(startTime: Date) {
//     this.startTime = startTime;
//   }
  
// }

export class Appointment {
  
  Id?: number;
  DoctorId: number| undefined;
  PatientId?: number;    
  StartTime!: Date; 
  EndTime!: string;
  Notes?: string;
  Status?: boolean;
  UserId?: number;

  get startDateTime(): Date {
    return new Date(this.StartTime);
  }

  get endDateTime(): Date {
    return new Date(this.EndTime);
  }
}

