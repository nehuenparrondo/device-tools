// src/components/organisms/ResponsiveGrid.tsx — Distribuye tarjetas según ancho y orientación.
import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useBreakpoint } from '@/hooks/useBreakpoint';
export function ResponsiveGrid({ children }: { children: ReactNode }) {
  const { columns } = useBreakpoint();
  return (
    <View style={styles.grid}>
      {Children.map(children, (child) => (
        <View style={[styles.item, { width: `${100 / columns}%` }]}>{child}</View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8, rowGap: 16 },
  item: { paddingHorizontal: 8 },
});
