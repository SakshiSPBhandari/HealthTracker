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
        { username: 'John Doe', workoutType: 'Running', minutes: 30 },
        { username: 'John Doe', workoutType: 'Cycling', minutes: 45 },
        { username: 'Jane Smith', workoutType: 'Swimming', minutes: 60 },
        { username: 'Jane Smith', workoutType: 'Running', minutes: 20 },
        { username: 'Mike Johnson', workoutType: 'Yoga', minutes: 50 },
        { username: 'Mike Johnson', workoutType: 'Cycling', minutes: 40 }
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
