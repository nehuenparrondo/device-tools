// src/services/cameraSession.ts — Aísla cada montaje para ignorar eventos de cámaras anteriores.
export interface CameraSession {
  id: number;
  facing: 'front' | 'back';
  active: boolean;
  ready: boolean;
  error: string | null;
}
export type CameraEvent =
  | { type: 'activity'; active: boolean }
  | { type: 'flip' }
  | { type: 'restart' }
  | { type: 'ready'; id: number }
  | { type: 'error'; id: number; message: string };
export function createCameraSession(active: boolean): CameraSession {
  return { id: 0, facing: 'back', active, ready: false, error: null };
}
export function cameraSessionReducer(state: CameraSession, event: CameraEvent): CameraSession {
  if (event.type === 'activity') {
    if (state.active === event.active) return state;
    return { ...state, id: state.id + 1, active: event.active, ready: false, error: null };
  }
  if (event.type === 'restart') return { ...state, id: state.id + 1, ready: false, error: null };
  if (event.type === 'flip') {
    if (!state.active || !state.ready) return state;
    return {
      ...state,
      id: state.id + 1,
      facing: state.facing === 'back' ? 'front' : 'back',
      ready: false,
      error: null,
    };
  }
  if (!state.active || event.id !== state.id) return state;
  if (event.type === 'error') return { ...state, ready: false, error: event.message };
  return state.error ? state : { ...state, ready: true };
}
