import { NativeTabs } from 'expo-router/native-tabs';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // 주기적으로 상단 개발 바를 찾아 강제로 제거하는 타이머 실행
      const timer = setInterval(() => {
        const navBar = document.querySelector('div[data-expo-router-native-tabs], header, #__expo-router-web-navigation');
        if (navBar) {
          navBar.remove();
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, []);

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}