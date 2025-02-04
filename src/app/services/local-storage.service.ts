import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageKey = 'workouts';

  constructor() {
    this.initializeDefaultData(); 
  }

  private initializeDefaultData() {
    if (!localStorage.getItem(this.storageKey) || localStorage.getItem(this.storageKey) === '[]') {
      const defaultData = [
        { username: 'john doe', workoutType: 'Running', minutes: 30 },
        { username: 'john doe', workoutType: 'Cycling', minutes: 45 },
        { username: 'jane smith', workoutType: 'Swimming', minutes: 60 },
        { username: 'jane smith', workoutType: 'Running', minutes: 20 },
        { username: 'mike johnson', workoutType: 'Yoga', minutes: 50 },
        { username: 'mike johnson', workoutType: 'Cycling', minutes: 40 }
      ];

      const capitalizedDefaultData = defaultData.map(workout => ({
        ...workout,
        username: this.capitalizeUsername(workout.username)
      }));

      localStorage.setItem(this.storageKey, JSON.stringify(capitalizedDefaultData));
    }
  }

  private capitalizeUsername(username: string): string {
    return username
      .split(' ') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
      .join(' '); 
  }

  getWorkouts(): any[] {
    try {
      const workouts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      console.log('Loaded Workouts:', workouts);
      return Array.isArray(workouts) ? workouts : [];
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
      return []; 
    }
  }

  saveWorkout(workout: any) {
    const capitalizedWorkout = {
      ...workout,
      username: this.capitalizeUsername(workout.username)
    };

    const workouts = this.getWorkouts();
    workouts.push(capitalizedWorkout);
    localStorage.setItem(this.storageKey, JSON.stringify(workouts));
  }
}
