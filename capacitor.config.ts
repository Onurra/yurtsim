import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onurra.yurtsim',
  appName: 'Yurt Simülatör',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      // Web splash'ı (#appSplash) hazır olana kadar koyu native splash göster.
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#1F1F1D',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
