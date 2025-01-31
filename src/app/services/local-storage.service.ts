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
    // Check if 'workouts' exists in localStorage and if it's empty
    if (!localStorage.getItem(this.storageKey) || localStorage.getItem(this.storageKey) === '[]') {
      const defaultData = [
        { username: 'john doe', workoutType: 'Running', minutes: 30 },
        { username: 'john doe', workoutType: 'Cycling', minutes: 45 },
        { username: 'jane smith', workoutType: 'Swimming', minutes: 60 },
        { username: 'jane smith', workoutType: 'Running', minutes: 20 },
        { username: 'mike johnson', workoutType: 'Yoga', minutes: 50 },
        { username: 'mike johnson', workoutType: 'Cycling', minutes: 40 }
      ];

      // Capitalize the usernames before saving them to localStorage
      const capitalizedDefaultData = defaultData.map(workout => ({
        ...workout,
        username: this.capitalizeUsername(workout.username)
      }));

      // Save capitalized data to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(capitalizedDefaultData));
    }
  }

  // Capitalize the first letter of each word in the username
  private capitalizeUsername(username: string): string {
    return username
      .split(' ') // Split by space
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
      .join(' '); // Join back the words with space
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
    // Capitalize the username before saving
    const capitalizedWorkout = {
      ...workout,
      username: this.capitalizeUsername(workout.username)
    };

    const workouts = this.getWorkouts();
    workouts.push(capitalizedWorkout);
    localStorage.setItem(this.storageKey, JSON.stringify(workouts));
  }
}
