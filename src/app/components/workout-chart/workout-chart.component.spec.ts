import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutChartComponent } from './workout-chart.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Chart } from 'chart.js';

describe('WorkoutChartComponent', () => {
  let component: WorkoutChartComponent;
  let fixture: ComponentFixture<WorkoutChartComponent>;

  const mockWorkouts = [
    { username: 'user1', workoutType: 'Running', minutes: 30 },
    { username: 'user1', workoutType: 'Cycling', minutes: 45 },
    { username: 'user2', workoutType: 'Running', minutes: 20 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WorkoutChartComponent,
        FormsModule,
        MatSelectModule,
        MatFormFieldModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutChartComponent);
    component = fixture.componentInstance;
    component.workouts = mockWorkouts;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get unique usernames', () => {
    const usernames = component.uniqueUsernames;
    expect(usernames).toEqual(['user1', 'user2']);
  });

  it('should initialize chart after view init', () => {
    const spy = spyOn(component, 'updateChart');
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should update chart on changes if canvas exists', () => {
    const spy = spyOn(component, 'updateChart');
    component.ngOnChanges({});
    expect(spy).not.toHaveBeenCalled(); // Canvas not initialized yet

    fixture.detectChanges(); // This triggers ngAfterViewInit
    component.ngOnChanges({});
    expect(spy).toHaveBeenCalled();
  });

  describe('updateChart', () => {
    beforeEach(() => {
      fixture.detectChanges(); // Initialize canvas
    });

    it('should create chart with filtered workouts when user selected', () => {
      component.selectedUser = 'user1';
      component.updateChart();
      
      const chartData = (component.chart as Chart).data;
      expect(chartData.labels).toContain('Running');
      expect(chartData.labels).toContain('Cycling');
      expect(chartData.datasets[0].data).toEqual([30, 45]); // user1's workout minutes
    });


    it('should handle empty workout data', () => {
      component.workouts = [];
      const consoleSpy = spyOn(console, 'warn');
      component.updateChart();
      
      expect(consoleSpy).toHaveBeenCalledWith('No workout data available!');
    });

    it('should handle missing canvas element', () => {
      const consoleSpy = spyOn(console, 'error');
      component.chartRef = undefined as any;
      component.updateChart();
      
      expect(consoleSpy).toHaveBeenCalledWith('Canvas element not found!');
    });

    it('should handle canvas context error', () => {
      const consoleSpy = spyOn(console, 'error');
      const mockCanvas = {
        nativeElement: {
          getContext: () => null
        }
      };
      component.chartRef = mockCanvas as any;
      component.updateChart();
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get 2D context!');
    });
  });
});