// app/(tabs)/_layout.tsx — Expo Router organiza las páginas mediante pestañas.
import { Tabs } from 'expo-router/js-tabs';
import { AppTabBar } from '@/components/organisms/AppTabBar';
import { TOOLS } from '@/constants/tools';
import { useTheme } from '@/hooks/useTheme';
export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
    >
      {TOOLS.map((tool) => (
        <Tabs.Screen key={tool.key} name={tool.key} options={{ title: tool.title }} />
      ))}
    </Tabs>
  );
}
