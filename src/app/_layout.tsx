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
      // 상단 개발 바를 감지하여 즉시 제거하는 함수
      const removeDevNavbar = () => {
        const selectors = [
          'div[data-expo-router-native-tabs]',
          'header',
          '#__expo-router-web-navigation',
          'div[class*="expo-router"]',
        ];
        
        selectors.forEach((selector) => {
          document.querySelectorAll(selector).forEach((el) => {
            // 메인 콘텐츠 영역이 아닌 상단 네비게이션 바만 타겟팅하여 제거
            if (el.textContent?.includes('Expo Starter') || el.textContent?.includes('Explore')) {
              el.remove();
            }
          });
        });
      };

      // 페이지 로드 직후 및 DOM 변화 감지 시 즉시 실행
      removeDevNavbar();
      const observer = new MutationObserver(removeDevNavbar);
      observer.observe(document.body, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
  }, []);
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}