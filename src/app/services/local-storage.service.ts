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
    if (!localStorage.getItem(this.storageKey)) {
      const defaultData = [
        [
          { username: 'john doe', workoutType: 'Running', minutes: 30 },
          { username: 'john doe', workoutType: 'Cycling', minutes: 45 },
          { username: 'jane smith', workoutType: 'Swimming', minutes: 60 },
          { username: 'jane smith', workoutType: 'Running', minutes: 20 },
          { username: 'mike johnson', workoutType: 'Yoga', minutes: 50 },
          { username: 'mike johnson', workoutType: 'Cycling', minutes: 40 }
        ]
        
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    }
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
    const workouts = this.getWorkouts();
    workouts.push(workout);
    localStorage.setItem(this.storageKey, JSON.stringify(workouts));
  }
}
