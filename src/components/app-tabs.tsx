import { NativeTabs } from 'expo-router/native-tabs';
import { Platform, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  // 웹 환경일 때 상단 개발 네비게이션 바를 숨기기 위한 스타일 주입
  if (Platform.OS === 'web') {
    // 웹 DOM 스타일을 조작하여 상단 불필요한 개발 바 영역 숨기기
    if (typeof document !== 'undefined') {
      const styleId = 'hide-expo-web-navbar';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          /* Expo Router 웹 개발 바 숨기기 */
          div[data-expo-router-native-tabs], 
          header, 
          #__expo-router-web-navigation {
            display: none !important;
          }
          /* 본문 화면이 상단에 딱 붙지 않도록 여백 확보 */
          body {
            padding-top: env(safe-area-inset-top);
          }
        `;
        document.head.appendChild(style);
      }
    }
  }

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