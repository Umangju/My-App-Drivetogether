import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 웹 환경일 때도 개발 바는 날리되, 오버레이나 알림 컴포넌트가 함께 동작하도록 Slot과 함께 배치
  if (Platform.OS === 'web') {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        {/* 웹 화면 메인 콘텐츠 */}
        <Slot />
        {/* 만약 별도의 전역 알림 컴포넌트(예: Toast)가 있다면 여기에 추가할 수 있습니다 */}
      </ThemeProvider>
    );
  }

  // 모바일 환경
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}