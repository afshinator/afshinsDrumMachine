/**
 * Type definitions for the drum machine composition system
 * File: /types/composition.ts
 */

/**
 * Represents a single beat/step in the pattern
 */
export type Beat = {
  /** Whether this beat is active (will play) */
  active: boolean;
  /** Optional per-beat volume override (0-1). If undefined, uses track volume */
  volume?: number;
};

/**
 * Represents a drum track/instrument
 */
export type Track = {
  /** Unique identifier for this track */
  id: string;
  /** Display name of the track */
  name: string;
  /** Reference to the sound file/ID to play */
  soundId: string;
  /** Track-level volume (0-1) */
  volume: number;
  /** Pattern data: bars[barIndex][stepIndex] */
  bars: Beat[][];
};

/**
 * Represents a section of the composition (e.g., Intro, Verse, Chorus)
 */
export type Section = {
  /** Unique identifier for this section */
  id: string;
  /** Display name (e.g., "Intro", "Verse 1", "Chorus") */
  name: string;
  /** First bar in this section (1-indexed) */
  startBar: number;
  /** Last bar in this section (1-indexed) */
  endBar: number;
  /** Color identifier for visual coding (theme color key) */
  color: SectionColor;
};

/**
 * Available section colors (maps to theme colors)
 */
export type SectionColor = 
  | 'blue' 
  | 'green' 
  | 'purple' 
  | 'orange' 
  | 'pink' 
  | 'yellow'
  | 'red'
  | 'cyan';

/**
 * Represents a complete drum machine composition
 */
export type Composition = {
  /** Unique identifier */
  id: string;
  /** User-facing title */
  title: string;
  /** ISO timestamp of creation */
  createdAt: string;
  /** ISO timestamp of last modification */
  modifiedAt: string;
  /** Tempo in beats per minute */
  tempo: number;
  /** Number of beats in each bar (e.g., 4 for 4/4 time) */
  beatsPerBar: number;
  /** Number of steps per beat (e.g., 4 for 16th notes in 4/4) */
  subdivision: number;
  /** Total number of bars in the composition */
  numberOfBars: number;
  /** Optional section markers for organizing bars */
  sections: Section[];
  /** All instrument tracks */
  tracks: Track[];
  /** IDs of sounds available for adding new tracks */
  availableSounds: string[];
};

/**
 * Metadata for a saved composition file (for library listing)
 */
export type CompositionMetadata = {
  id: string;
  title: string;
  createdAt: string;
  modifiedAt: string;
  tempo: number;
  numberOfBars: number;
  trackCount: number;
  /** File path or storage key */
  filePath: string;
};

/**
 * Available drum sound definition
 */
export type DrumSound = {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** File path or asset require */
  source: string | number; // string for URI, number for require()
  /** Category for grouping sounds */
  category: SoundCategory;
};

/**
 * Sound categories for organization
 */
export type SoundCategory = 
  | 'congas'
  | 'djembe'
  | 'bongos'
  | 'timbales'
  | 'shakers'
  | 'bells'
  | 'wood'
  | 'metallic'
  | 'other';

/**
 * Playback state
 */
export type PlaybackState = 'playing' | 'stopped' | 'paused';

/**
 * Current playback position
 */
export type PlaybackPosition = {
  /** Current bar (0-indexed internally) */
  bar: number;
  /** Current step within the bar (0-indexed) */
  step: number;
};

/**
 * Settings for creating a new composition
 */
export type NewCompositionSettings = {
  title: string;
  tempo: number;
  beatsPerBar: number;
  subdivision: number;
  numberOfBars: number;
  /** Initial tracks to add (sound IDs) */
  initialSounds?: string[];
};

/**
 * Helper type for creating a new empty beat
 */
export const createEmptyBeat = (): Beat => ({
  active: false,
});

/**
 * Helper function to create empty bars for a track
 */
export const createEmptyBars = (
  numberOfBars: number,
  stepsPerBar: number
): Beat[][] => {
  return Array(numberOfBars)
    .fill(null)
    .map(() => 
      Array(stepsPerBar)
        .fill(null)
        .map(() => createEmptyBeat())
    );
};

/**
 * Helper function to create a new track
 */
export const createTrack = (
  soundId: string,
  soundName: string,
  numberOfBars: number,
  stepsPerBar: number
): Track => ({
  id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: soundName,
  soundId,
  volume: 0.8,
  bars: createEmptyBars(numberOfBars, stepsPerBar),
});

/**
 * Helper function to create a new section
 */
export const createSection = (
  name: string,
  startBar: number,
  endBar: number,
  color: SectionColor = 'blue'
): Section => ({
  id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name,
  startBar,
  endBar,
  color,
});

/**
 * Helper function to create a new composition
 */
export const createComposition = (
  settings: NewCompositionSettings
): Composition => {
  const stepsPerBar = settings.beatsPerBar * settings.subdivision;
  const now = new Date().toISOString();
  
  return {
    id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: settings.title,
    createdAt: now,
    modifiedAt: now,
    tempo: settings.tempo,
    beatsPerBar: settings.beatsPerBar,
    subdivision: settings.subdivision,
    numberOfBars: settings.numberOfBars,
    sections: [],
    tracks: [],
    availableSounds: [], // Will be populated from sound library
  };
};

/**
 * Validation helper to ensure composition data integrity
 */
export const validateComposition = (comp: Composition): string[] => {
  const errors: string[] = [];
  
  if (comp.tempo < 40 || comp.tempo > 300) {
    errors.push('Tempo must be between 40 and 300 BPM');
  }
  
  if (comp.beatsPerBar < 1 || comp.beatsPerBar > 12) {
    errors.push('Beats per bar must be between 1 and 12');
  }
  
  if (comp.numberOfBars < 1) {
    errors.push('Must have at least 1 bar');
  }
  
  const stepsPerBar = comp.beatsPerBar * comp.subdivision;
  
  // Validate each track
  comp.tracks.forEach((track, idx) => {
    if (track.bars.length !== comp.numberOfBars) {
      errors.push(`Track ${idx} has ${track.bars.length} bars, expected ${comp.numberOfBars}`);
    }
    
    track.bars.forEach((bar, barIdx) => {
      if (bar.length !== stepsPerBar) {
        errors.push(`Track ${idx}, bar ${barIdx} has ${bar.length} steps, expected ${stepsPerBar}`);
      }
    });
    
    if (track.volume < 0 || track.volume > 1) {
      errors.push(`Track ${idx} volume must be between 0 and 1`);
    }
  });
  
  // Validate sections
  comp.sections.forEach((section, idx) => {
    if (section.startBar < 1 || section.startBar > comp.numberOfBars) {
      errors.push(`Section ${idx} start bar is out of range`);
    }
    if (section.endBar < section.startBar || section.endBar > comp.numberOfBars) {
      errors.push(`Section ${idx} end bar is invalid`);
    }
  });
  
  return errors;
};