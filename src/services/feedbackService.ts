// src/services/feedbackService.ts — La háptica es opcional y no bloquea acciones principales.
import * as Haptics from 'expo-haptics';
import { Platform, Vibration } from 'react-native';
export async function tapFeedback(): Promise<void> {
  if (Platform.OS !== 'web') await Haptics.selectionAsync().catch(() => undefined);
}
export async function successFeedback(): Promise<void> {
  if (Platform.OS !== 'web')
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => undefined,
    );
}
export function shakeFeedback(): void {
  if (Platform.OS !== 'web') Vibration.vibrate(120);
}
