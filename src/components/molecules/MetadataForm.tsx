// src/components/molecules/MetadataForm.tsx — Campos controlados para nota y etiquetas opcionales.
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { useTheme } from '@/hooks/useTheme';
export function MetadataForm({
  note,
  tags,
  onNoteChange,
  onTagsChange,
}: {
  note: string;
  tags: string;
  onNoteChange(value: string): void;
  onTagsChange(value: string): void;
}) {
  const { colors } = useTheme();
  const themed = {
    color: colors.text,
    borderColor: colors.border,
    backgroundColor: colors.background,
  };
  return (
    <>
      <AppText variant="small" muted>
        Nota opcional · máximo 200 caracteres
      </AppText>
      <TextInput
        accessibilityLabel="Nota del registro"
        placeholder="¿Qué querés recordar?"
        placeholderTextColor={colors.muted}
        value={note}
        onChangeText={onNoteChange}
        maxLength={200}
        multiline
        style={[styles.input, themed]}
      />
      <AppText variant="small" muted>
        Hasta 5 etiquetas, separadas por comas
      </AppText>
      <TextInput
        accessibilityLabel="Etiquetas del registro"
        placeholder="clase, prueba"
        placeholderTextColor={colors.muted}
        value={tags}
        onChangeText={onTagsChange}
        maxLength={130}
        style={[styles.input, themed]}
      />
    </>
  );
}
const styles = StyleSheet.create({
  input: { minHeight: 48, padding: 12, borderWidth: 1, borderRadius: 12, fontSize: 16 },
});
