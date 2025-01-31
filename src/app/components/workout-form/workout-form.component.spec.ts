import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutFormComponent } from './workout-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventEmitter } from '@angular/core';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        WorkoutFormComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    component.addWorkout = new EventEmitter();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form and be invalid', () => {
    expect(component.workoutForm.value).toEqual({
      username: '',
      workoutType: '',
      minutes: ''
    });
    expect(component.workoutForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = component.workoutForm;
    
    // Check initial state
    expect(form.get('username')?.errors?.['required']).toBeTrue();
    expect(form.get('workoutType')?.errors?.['required']).toBeTrue();
    expect(form.get('minutes')?.errors?.['required']).toBeTrue();

    // Fill in valid data
    form.patchValue({
      username: 'testuser',
      workoutType: 'running',
      minutes: 30
    });

    fixture.detectChanges();

    // Check that fields are now valid
    expect(form.get('username')?.valid).toBeTrue();
    expect(form.get('workoutType')?.valid).toBeTrue();
    expect(form.get('minutes')?.valid).toBeTrue();
    expect(form.valid).toBeTrue();
  });

  it('should validate minutes range', () => {
    const minutesControl = component.workoutForm.get('minutes');
    
    minutesControl?.setValue(0);
    expect(minutesControl?.errors?.['min']).toBeTruthy();

    minutesControl?.setValue(301);
    expect(minutesControl?.errors?.['max']).toBeTruthy();

    minutesControl?.setValue(150);
    expect(minutesControl?.errors).toBeNull();
  });

  it('should emit form value on valid submission', () => {
    const emitSpy = spyOn(component.addWorkout, 'emit');
    const testWorkout = {
      username: 'testuser',
      workoutType: 'running',
      minutes: 30
    };

    component.workoutForm.setValue(testWorkout);
    fixture.detectChanges();
    
    component.onSubmit();
    expect(emitSpy).toHaveBeenCalledWith(testWorkout);
  });

  it('should not emit on invalid form submission', () => {
    const emitSpy = spyOn(component.addWorkout, 'emit');
    component.onSubmit();
    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.workoutForm.get('username')?.errors?.['required']).toBeTrue();
  });

  it('should handle form submission with trimmed values', () => {
    const emitSpy = spyOn(component.addWorkout, 'emit');
    const testWorkout = {
      username: '  testuser  ',
      workoutType: 'running',
      minutes: 30
    };

    component.workoutForm.setValue(testWorkout);
    fixture.detectChanges();
    
    component.onSubmit();
    expect(emitSpy).toHaveBeenCalledWith({
      username: 'testuser',
      workoutType: 'running',
      minutes: 30
    });
  });
});