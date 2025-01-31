import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;

  @Output() addWorkout = new EventEmitter<any>();
  @ViewChild('usernameInput', { static: true }) usernameInput!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.workoutForm = this.fb.group({
      username: ['', Validators.required],
      workoutType: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1), Validators.max(300)]]
    });
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      // Trim username before emitting
      const formValue = {
        ...this.workoutForm.value,
        username: this.workoutForm.value.username.trim()
      };

      this.addWorkout.emit(formValue);
      this.workoutForm.reset();

      Object.keys(this.workoutForm.controls).forEach(key => {
        this.workoutForm.controls[key].setErrors(null);
      });

      // Use optional chaining to prevent null/undefined errors
      this.usernameInput?.nativeElement?.focus();
    }
  }
}