import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.craftr.app',
  appName: 'Craftr',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
