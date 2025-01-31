import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-workout-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './workout-table.component.html',
  styleUrls: ['./workout-table.component.css']
})
export class WorkoutTableComponent implements OnInit, OnChanges {
  
  @Input() workouts: any[] = [];

  filterUsername: string = '';
  filterWorkoutType: string = '';
  filteredWorkouts: any[] = [];
  paginatedWorkouts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  
  displayedColumns: string[] = ['username', 'workouts', 'workoutCount', 'minutes'];


  get totalPages(): number {
    return Math.ceil(this.filteredWorkouts.length / this.pageSize);
  }

  ngOnInit() {
    this.applyFilters();
  }

  ngOnChanges() {
    this.applyFilters();
  }
  applyFilters() {
    let filteredData = [...this.workouts];
  
    if (this.filterUsername.trim() !== '') {
      filteredData = filteredData.filter(workout =>
        workout.username.toLowerCase().includes(this.filterUsername.toLowerCase())
      );
    }
  
    if (this.filterWorkoutType.trim() !== '') {
      filteredData = filteredData.filter(workout =>
        workout.workoutType.toLowerCase().includes(this.filterWorkoutType.toLowerCase())
      );
    }
  
    const workoutMap = new Map<string, any>();
  
    filteredData.forEach(workout => {
      const key = workout.username;
  
      if (workoutMap.has(key)) {
        const existing = workoutMap.get(key);
        existing.workoutCount += 1;
        existing.minutes += workout.minutes;
        if (!existing.workouts.includes(workout.workoutType)) {
          existing.workouts.push(workout.workoutType);
        }
      } else {
        workoutMap.set(key, {
          username: workout.username,
          workouts: [workout.workoutType],
          workoutCount: 1,
          minutes: workout.minutes
        });
      }
    });
  
    this.filteredWorkouts = Array.from(workoutMap.values());
    this.currentPage = 1;
    this.updatePaginatedWorkouts();
  }
  

  updatePaginatedWorkouts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedWorkouts = this.filteredWorkouts.slice(startIndex, endIndex);
  }

  changePage(increment: number) {
    const newPage = this.currentPage + increment;
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePaginatedWorkouts();
    }
  }
}
