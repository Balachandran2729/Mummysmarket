import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';


export default function App() {
  return (
    <View className="flex-1">
      <StatusBar style="auto" />  
        <Text className="text-2xl font-bold text-white">
          MummysMarket
        </Text>
    </View>
  );
}
