// src/components/atoms/ThemeToggleButton.tsx — Alterna el tema desde el layout raíz.
import { useTheme } from '@/hooks/useTheme';
import { IconButton } from './IconButton';
export function ThemeToggleButton() {
  const { mode, toggleTheme } = useTheme();
  return (
    <IconButton
      icon={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
      label={`Activar tema ${mode === 'dark' ? 'claro' : 'oscuro'}`}
      onPress={toggleTheme}
    />
  );
}
