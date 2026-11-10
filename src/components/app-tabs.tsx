import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { Image, Platform, useColorScheme } from 'react-native';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  // 1. 웹 환경일 때는 개발 바를 만드는 NativeTabs 대신 표준 탭을 사용하여 원천 차단
  if (Platform.OS === 'web') {
    return (
      <Tabs
        screenOptions={{
          headerShown: false, // 웹 상단 헤더/개발 바 완전 숨김
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.backgroundElement,
          },
          tabBarActiveTintColor: colors.text,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                source={require('@/assets/images/tabIcons/home.png')}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                source={require('@/assets/images/tabIcons/explore.png')}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            ),
          }}
        />
      </Tabs>
    );
  }

  // 2. 모바일(iOS / Android) 환경에서는 기존 NativeTabs 그대로 유지
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