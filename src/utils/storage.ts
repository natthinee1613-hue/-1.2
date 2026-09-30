import { PoliceOfficer } from '../types/police';
import { INITIAL_POLICE_OFFICERS } from '../data/initialPoliceData';

const STORAGE_KEY = 'police_roster_data_v1';

export function loadOfficersFromStorage(): PoliceOfficer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveOfficersToStorage(INITIAL_POLICE_OFFICERS);
      return INITIAL_POLICE_OFFICERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load officers from localStorage:', err);
  }
  return INITIAL_POLICE_OFFICERS;
}

export function saveOfficersToStorage(officers: PoliceOfficer[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(officers));
  } catch (err) {
    console.error('Failed to save officers to localStorage:', err);
  }
}

export function resetOfficersToDefault(): PoliceOfficer[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POLICE_OFFICERS));
  } catch (err) {
    console.error('Failed to reset officers:', err);
  }
  return INITIAL_POLICE_OFFICERS;
}
