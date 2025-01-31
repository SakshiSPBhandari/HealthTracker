import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let localStorageMock: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorageMock = window.localStorage;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize default data if localStorage is empty', () => {
    localStorage.removeItem('workouts'); // Ensure no previous data
    const serviceInstance = new LocalStorageService(); // Creating a new instance to trigger initialization

    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    expect(workouts.length).toBeGreaterThan(0);
  });

  it('should not override existing data if localStorage already contains workouts', () => {
    const existingData = [
      { username: 'Alice', workoutType: 'Yoga', minutes: 30 },
    ];
    localStorage.setItem('workouts', JSON.stringify(existingData));

    const serviceInstance = new LocalStorageService();
    const workouts = serviceInstance.getWorkouts();
    
    expect(workouts.length).toBe(1);
    expect(workouts[0].username).toBe('Alice');
  });

  it('should save a workout and persist it in localStorage', () => {
    const newWorkout = { username: 'John Doe', workoutType: 'Running', minutes: 45 };

    service.saveWorkout(newWorkout);
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');

    expect(workouts.length).toBe(1);
    expect(workouts[0]).toEqual(newWorkout);
  });

  it('should retrieve workouts from localStorage', () => {
    const mockData = [
      { username: 'Alice', workoutType: 'Yoga', minutes: 30 },
      { username: 'Bob', workoutType: 'Cycling', minutes: 40 },
    ];
    localStorage.setItem('workouts', JSON.stringify(mockData));

    const workouts = service.getWorkouts();
    expect(workouts.length).toBe(2);
    expect(workouts).toEqual(mockData);
  });

  it('should return an empty array if localStorage contains invalid JSON', () => {
    localStorage.setItem('workouts', 'invalid json');
    
    const workouts = service.getWorkouts();
    expect(workouts).toEqual([]);
  });

  it('should return an empty array if localStorage contains non-array data', () => {
    localStorage.setItem('workouts', JSON.stringify({ username: 'John' }));

    const workouts = service.getWorkouts();
    expect(workouts).toEqual([]);
  });
});
