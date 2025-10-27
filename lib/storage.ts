import { participantNameSchema, ParticipantName } from '@/types/quiz';

const PARTICIPANT_NAME_KEY = 'quiz_participant_name';

/**
 * Save participant name to localStorage with validation
 */
export function saveParticipantName(name: string): void {
  try {
    const validated = participantNameSchema.parse({ name });
    localStorage.setItem(PARTICIPANT_NAME_KEY, JSON.stringify(validated));
  } catch (error) {
    console.error('Failed to save participant name:', error);
    throw new Error('Invalid participant name');
  }
}

/**
 * Load participant name from localStorage with validation
 */
export function loadParticipantName(): string | null {
  try {
    const stored = localStorage.getItem(PARTICIPANT_NAME_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const validated = participantNameSchema.parse(parsed);
    return validated.name;
  } catch (error) {
    console.error('Failed to load participant name:', error);
    // Clear invalid data
    localStorage.removeItem(PARTICIPANT_NAME_KEY);
    return null;
  }
}

/**
 * Clear participant name from localStorage
 */
export function clearParticipantName(): void {
  localStorage.removeItem(PARTICIPANT_NAME_KEY);
}
