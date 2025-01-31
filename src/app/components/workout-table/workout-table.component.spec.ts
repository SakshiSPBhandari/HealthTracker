import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutTableComponent } from './workout-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

describe('WorkoutTableComponent', () => {
  let component: WorkoutTableComponent;
  let fixture: ComponentFixture<WorkoutTableComponent>;

  const mockWorkouts = [
    { username: 'user1', workoutType: 'Running', minutes: 30 },
    { username: 'user1', workoutType: 'Cycling', minutes: 45 },
    { username: 'user2', workoutType: 'Running', minutes: 20 },
    { username: 'user3', workoutType: 'Swimming', minutes: 60 },
    { username: 'user3', workoutType: 'Swimming', minutes: 30 },
    { username: 'user4', workoutType: 'Yoga', minutes: 45 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WorkoutTableComponent,
        NoopAnimationsModule,
        FormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutTableComponent);
    component = fixture.componentInstance;
    component.workouts = mockWorkouts;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.filterUsername).toBe('');
      expect(component.filterWorkoutType).toBe('');
      expect(component.currentPage).toBe(1);
      expect(component.pageSize).toBe(5);
    });

    it('should call applyFilters on ngOnInit', () => {
      const spy = spyOn(component, 'applyFilters');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should call applyFilters on ngOnChanges', () => {
      const spy = spyOn(component, 'applyFilters');
      component.ngOnChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Filtering', () => {
    it('should filter by username', () => {
      component.filterUsername = 'user1';
      component.applyFilters();
      expect(component.filteredWorkouts.length).toBe(1);
      expect(component.filteredWorkouts[0].username).toBe('user1');
    });

    it('should filter by workout type', () => {
      component.filterWorkoutType = 'Running';
      component.applyFilters();
      expect(component.filteredWorkouts.length).toBe(2);
      expect(component.filteredWorkouts[0].workouts).toContain('Running');
    });

    it('should handle case-insensitive filtering', () => {
      component.filterUsername = 'USER1';
      component.applyFilters();
      expect(component.filteredWorkouts.length).toBe(1);
      expect(component.filteredWorkouts[0].username).toBe('user1');
    });

    it('should handle empty filters', () => {
      component.filterUsername = '';
      component.filterWorkoutType = '';
      component.applyFilters();
      expect(component.filteredWorkouts.length).toBe(4);
    });

    it('should aggregate workout data correctly', () => {
      component.filterUsername = 'user1';
      component.applyFilters();
      const user1Data = component.filteredWorkouts[0];
      expect(user1Data.workoutCount).toBe(2);
      expect(user1Data.minutes).toBe(75);
      expect(user1Data.workouts).toContain('Running');
      expect(user1Data.workouts).toContain('Cycling');
    });

    it('should handle duplicate workout types', () => {
      component.filterUsername = 'user3';
      component.applyFilters();
      const user3Data = component.filteredWorkouts[0];
      expect(user3Data.workoutCount).toBe(2);
      expect(user3Data.workouts.length).toBe(1);
      expect(user3Data.minutes).toBe(90);
    });
  });

  describe('Pagination', () => {
    it('should calculate total pages correctly', () => {
      expect(component.totalPages).toBe(1);
      component.pageSize = 2;
      component.applyFilters();
      expect(component.totalPages).toBe(2);
    });

    it('should update paginated workouts correctly', () => {
      component.pageSize = 2;
      component.applyFilters();
      expect(component.paginatedWorkouts.length).toBe(2);
    });

    it('should handle page changes within bounds', () => {
      component.pageSize = 2;
      component.applyFilters();
      
      component.changePage(1);
      expect(component.currentPage).toBe(2);
      expect(component.paginatedWorkouts.length).toBe(2);
    });

    it('should not change page beyond bounds', () => {
      component.changePage(-1);
      expect(component.currentPage).toBe(1);

      component.changePage(10);
      expect(component.currentPage).toBe(1);
    });

    it('should reset to first page when filters change', () => {
      component.pageSize = 2;
      component.applyFilters();
      component.changePage(1);
      expect(component.currentPage).toBe(2);

      component.filterUsername = 'user1';
      component.applyFilters();
      expect(component.currentPage).toBe(1);
    });
  });
});