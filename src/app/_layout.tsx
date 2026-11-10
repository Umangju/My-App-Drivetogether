import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const destroyDevBar = () => {
        // DOM 전체를 뒤져서 'Expo Starter' 텍스트를 포함하는 상단 바 요소 강제 삭제
        const allElements = document.querySelectorAll('div, header, nav');
        allElements.forEach((el) => {
          if (el.textContent && el.textContent.includes('Expo Starter') && el.children.length < 5) {
            el.remove();
          }
        });
      };

      destroyDevBar();
      const interval = setInterval(destroyDevBar, 50); // 0.05초마다 감시해서 뜨는 족족 삭제
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}