import 'react-native-gesture-handler';
import { LogBox, Platform } from 'react-native';

if (Platform.OS === 'web') {
  require('./src/styles/tailwind.css');
}

if (__DEV__) {
  LogBox.ignoreLogs(['Cannot record touch end without a touch start.']);
}
import { AppProviders } from './src/core/providers/AppProviders';
import { CardSenseApp } from './src/core/CardSenseApp';

export default function App() {
  return (
    <AppProviders>
      <CardSenseApp />
    </AppProviders>
  );
}
