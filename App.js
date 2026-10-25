
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import Motorista from './components/motorista';
import HomeScreen from './screens/HomeScreen';
import NvViagenScreen from './screens/NvViagenScreen';
import FaturamentoScreen from './screens/FaturamentoScreen';


const Tab = createBottomTabNavigator();


export default function App() {
  return(
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

function AppNavigator(){
  const insets = useSafeAreaInsets();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Início"
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#777',
          tabBarStyle: {
            height: 55 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 8),
            paddingTop: 8,
          },
          
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Início') {
              iconName = 'home-outline';
            } else if (route.name === 'Meu faturamento') {
              iconName = 'list-outline';
            } else {
              iconName = 'add-circle-outline';
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Início"
          component={HomeScreen}
        />


        <Tab.Screen
          name="Lançamento de Viagens"
          component={NvViagenScreen}
        />

        <Tab.Screen
          name="Meu faturamento"
          component={FaturamentoScreen}
        />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
