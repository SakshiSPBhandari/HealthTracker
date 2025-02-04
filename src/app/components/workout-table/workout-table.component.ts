import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workout-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './workout-table.component.html'
})
export class WorkoutTableComponent implements OnInit, OnChanges {
  @Input() workouts: any[] = [];
  
  filterUsername: string = '';
  dropdownOpen: boolean = false;
  workoutTypes: string[] = ['Cardio', 'Strength', 'Yoga', 'Running', 'Swimming'];
  selectedWorkoutTypes: { [key: string]: boolean } = {};
  allSelected: boolean = true;
  
  filteredWorkouts: any[] = [];
  paginatedWorkouts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor() {
    this.workoutTypes.forEach(type => {
      this.selectedWorkoutTypes[type] = true;
    });
  }

  ngOnInit() {
    this.applyFilters();
  }

  ngOnChanges() {
    this.applyFilters();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectAllWorkoutTypes() {
    this.allSelected = !this.allSelected;
    this.workoutTypes.forEach(type => {
      this.selectedWorkoutTypes[type] = this.allSelected;
    });
    this.applyFilters();
  }

  toggleWorkoutType(type: string) {
    this.selectedWorkoutTypes[type] = !this.selectedWorkoutTypes[type];
    this.allSelected = this.workoutTypes.every(type => this.selectedWorkoutTypes[type]);
    this.applyFilters();
  }

  getSelectedWorkoutTypesText(): string {
    const selectedTypes = this.workoutTypes.filter(type => this.selectedWorkoutTypes[type]);
    if (selectedTypes.length === this.workoutTypes.length) return 'All Workout Types';
    if (selectedTypes.length === 0) return 'Select Workout Types';
    if (selectedTypes.length <= 2) return selectedTypes.join(', ');
    return `${selectedTypes.length} types selected`;
  }

  applyFilters() {
    let groupedWorkouts = this.workouts.reduce((acc: any, curr: any) => {
      if (!acc[curr.username]) {
        acc[curr.username] = {
          username: curr.username,
          workouts: new Set(),
          workoutCount: 0,
          minutes: 0
        };
      }
      acc[curr.username].workouts.add(curr.workoutType);
      acc[curr.username].workoutCount++;
      acc[curr.username].minutes += curr.minutes;
      return acc;
    }, {});

    this.filteredWorkouts = Object.values(groupedWorkouts)
      .map((workout: any) => ({
        ...workout,
        workouts: Array.from(workout.workouts)
      }))
      .filter(workout => {
        const usernameMatch = workout.username.toLowerCase().includes(this.filterUsername.toLowerCase());
        const workoutTypeMatch = workout.workouts.some((type: string) => 
          this.selectedWorkoutTypes[type]
        );
        return usernameMatch && workoutTypeMatch;
      });

    this.totalPages = Math.ceil(this.filteredWorkouts.length / this.pageSize);
    this.currentPage = 1;
    this.updatePaginatedWorkouts();
  }

  updatePaginatedWorkouts() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedWorkouts = this.filteredWorkouts.slice(start, end);
  }

  changePage(delta: number) {
    const newPage = this.currentPage + delta;
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePaginatedWorkouts();
    }
  }
}