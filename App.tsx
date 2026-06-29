import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

const App: React.FC = () => (
  <GestureHandlerRootView style={styles.root}>
    <RootNavigator />
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
