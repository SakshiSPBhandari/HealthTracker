import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 

Chart.register(...registerables);

@Component({
  selector: 'app-workout-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatFormFieldModule],  
  templateUrl: './workout-chart.component.html',
  styleUrls: ['./workout-chart.component.css']
})
export class WorkoutChartComponent implements OnChanges, AfterViewInit {
  @Input() workouts: any[] = [];
  @ViewChild('chartCanvas', { static: false }) chartRef!: ElementRef<HTMLCanvasElement>;

  selectedUser: string = '';
  chart: Chart | undefined;

  get uniqueUsernames(): string[] {
    return [...new Set(this.workouts.map(workout => workout.username))];
  }

  ngAfterViewInit() {
    this.updateChart();
  }

  ngOnChanges(p0: unknown) {
    if (this.chartRef?.nativeElement) {
      this.updateChart();
    }
  }

  updateChart() {
    
    if (!this.chartRef?.nativeElement) {
      console.error('Canvas element not found!');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const filteredWorkouts = this.selectedUser
      ? this.workouts.filter(workout => workout.username === this.selectedUser)
      : this.workouts;

    if (filteredWorkouts.length === 0) {
      console.warn('No workout data available!');
      return;
    }

    const workoutData: { [key: string]: number } = {};
    filteredWorkouts.forEach(workout => {
      workoutData[workout.workoutType] = (workoutData[workout.workoutType] || 0) + workout.minutes;
    });

    const labels = Object.keys(workoutData);
    const data = Object.values(workoutData);

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context!');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `Workout Minutes (${this.selectedUser || 'All Users'})`,
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    } as ChartConfiguration);
  }
}
