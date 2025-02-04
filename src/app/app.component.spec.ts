import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutFormComponent } from '../app/components/workout-form/workout-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
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
    
    expect(form.get('username')?.errors?.['required']).toBeTrue();
    expect(form.get('workoutType')?.errors?.['required']).toBeTrue();
    expect(form.get('minutes')?.errors?.['required']).toBeTrue();

    form.patchValue({
      username: 'testuser',
      workoutType: 'running',
      minutes: 30
    });

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
    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith(testWorkout);
  });

  it('should not emit or reset on invalid form submission', () => {
    const emitSpy = spyOn(component.addWorkout, 'emit');
    
    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.workoutForm.get('username')?.errors?.['required']).toBeTrue();
  });
});