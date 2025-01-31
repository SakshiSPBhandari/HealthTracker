import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutTableComponent } from './components/workout-table/workout-table.component';
import { WorkoutChartComponent } from './components/workout-chart/workout-chart.component';
import { LocalStorageService } from './services/local-storage.service';
import { FormsModule } from '@angular/forms';


@Component({
selector: 'app-root',
standalone: true,
imports: [CommonModule, FormsModule, WorkoutFormComponent, WorkoutTableComponent, WorkoutChartComponent],
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
title = "workout-tracker";
workouts: any[] = [];
activeTab: string = 'form'; 

constructor(private localStorageService: LocalStorageService) {}

ngOnInit() {
  this.workouts = this.localStorageService.getWorkouts();
}

addWorkout(workout: any) {
  workout.username = workout.username.trim().toLowerCase(); 
  this.localStorageService.saveWorkout(workout);
  this.workouts = this.localStorageService.getWorkouts();
  this.activeTab = 'table';
}

setActiveTab(tab: string) {
  this.activeTab = tab;
}
}
