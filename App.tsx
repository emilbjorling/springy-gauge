import React from 'react';
import { SafeAreaView, View } from 'react-native';

import { GaugeV2 } from './src/Gauge';

const App = () => (
  <SafeAreaView>
    <View
      style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <GaugeV2 size={200} />
      <View style={{ flexDirection: 'row' }}>
        <GaugeV2 size={150} />
        <GaugeV2 size={150} />
      </View>
    </View>
  </SafeAreaView>
);

export default App;
