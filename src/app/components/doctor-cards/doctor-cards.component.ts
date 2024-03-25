import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DoctorsService } from '../../doctors.service';
import { RouterLink } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { SignalRService } from '../../signal-r.service';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Doctor } from '../../models/doctor.model';
import { FilterService } from '../../filter.service';


interface PaginatedDoctorResult {
  TotalCount: number;
  PageSize: number;
  PageNumber: number;
  Doctors: Doctor[];
}

@Component({
  selector: 'app-doctor-cards',
  templateUrl: './doctor-cards.component.html',
  styleUrl: './doctor-cards.component.css'
})

export class DoctorCardsComponent implements OnInit {  
  faEye=faEye;
  faAngleRight=faAngleRight;  
  
  currentPage: number = 1;
  pageSize: number = 6;
  pageNumber:number=1;
  totalCount: number = 0;
  doctors: Doctor[] = [];

  filteredDoctors: Doctor[] = [];

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.signalRService.startConnection();
  this.signalRService.addViewCountListener(this.updateViewCount);

  this.subscribeToFilterChanges();

  
  this.loadDoctorsPaginated(this.currentPage, this.pageSize);
  }
  constructor(
    private cdr:ChangeDetectorRef,
    public doctorsService: DoctorsService,
    private signalRService: SignalRService,
    public filterService:FilterService
  ) {}

totalPages: number = 0;
subscribeToFilterChanges(): void {
  this.filterService.currentFilter.subscribe(filterTerm => {
    this.applyFilter(filterTerm);
  });
}

applyFilter(filterTerm: string): void {
  if (!filterTerm) {
    this.filteredDoctors = this.doctors;
  } else {
    const filterWords = filterTerm.toLowerCase().split(/\s+/);

    this.filteredDoctors = this.doctors.filter(doctor => {
      const doctorFname = doctor.Fname?.toLowerCase() || '';
      const doctorCategory = (doctor.Category || '').toLowerCase();

      return filterWords.some(word => doctorFname.includes(word) || doctorCategory.includes(word));
    });
  }
 
  const isDataFound = this.filteredDoctors.length > 0;
  
  this.filterService.updateDataFoundState(isDataFound);

  this.cdr.detectChanges();
}

loadDoctorsPaginated(pageNumber: number, pageSize: number): void {
  this.doctorsService.getDoctorsPaginated(pageNumber, pageSize).subscribe({
    next: (result: PaginatedDoctorResult) => {
      console.log(result);
      this.doctors = result.Doctors;
      this.totalCount = result.TotalCount;
      this.currentPage = pageNumber;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);

      this.applyFilter(this.filterService.filterTermSource.getValue());
    },
    error: (error) => {
      console.error('Error fetching doctors:', error);
    }
  });
}
  
  public updateViewCount = (doctorId: number, viewCount: number) => {
    const doctor = this.doctorsService.DoctorsList.find((d) => d.Id === doctorId);
    if (doctor) {
      doctor.ViewCount = viewCount;
    }
  };

  
  getStars(score: number | undefined) {
  
      const validScore = score ?? 1;
      return new Array(5).fill(false).map((_, index) => index < validScore);
    
  }
  

 
    incrementViewCount(doctorId: number | null): void {
      if (doctorId === null) {
        console.warn('Cannot increment view count: doctor ID is null');
        return;
      }
    this.doctorsService.incrementViewCount(doctorId);
  }

  loadNextPage(): void {
    if (this.currentPage * this.pageSize < this.totalCount) {
      this.loadDoctorsPaginated(++this.currentPage, this.pageSize);
    }
  }
  
 
}
