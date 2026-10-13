// src/components/organisms/AppTabBar.tsx — Pestañas desplazables con áreas táctiles sin comprimir.
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/atoms/AppText';
import { TOOLS } from '@/constants/tools';
import { useTheme } from '@/hooks/useTheme';
export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.content, { minWidth: width }]}
      >
        {state.routes.map((route, index) => {
          const tool = TOOLS.find((item) => item.key === route.name);
          const selected = state.index === index;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tool?.title ?? route.name}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!selected && !event.defaultPrevented)
                  navigation.navigate(route.name, route.params);
              }}
              style={[
                styles.tab,
                {
                  minHeight: Math.max(72, 48 + 24 * fontScale),
                  backgroundColor: selected ? colors.raised : colors.surface,
                },
              ]}
            >
              <Ionicons
                name={tool?.icon ?? 'ellipse-outline'}
                size={22}
                color={selected ? colors.primary : colors.muted}
              />
              <AppText
                variant="small"
                style={[styles.label, { color: selected ? colors.primary : colors.muted }]}
              >
                {tool?.shortTitle ?? route.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
      <View />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  bar: { borderTopWidth: 1 },
  content: { paddingHorizontal: 8, gap: 4 },
  tab: {
    minWidth: 80,
    flexGrow: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 16,
  },
  label: { textAlign: 'center' },
});
