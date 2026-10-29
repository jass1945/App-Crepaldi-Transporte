
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from './screens/HomeScreen';
import NvViagenScreen from './screens/NvViagenScreen';
import ViagensScreen from './screens/ViagensScreen';
import FaturamentoScreen from './screens/FaturamentoScreen';
import CombustivelScreen from './screens/CombustivelScreen';
import NvAbastecidaScreen from './screens/NvAbastecidaScreen';
import LoginScreen from './screens/LoginScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


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
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
        />


        <Stack.Screen
      name="Principal"
      options={{ headerShown: false }}>
      {() => (
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
                iconName = 'bar-chart';
              } else if (route.name === 'Lançamento de Viagens') {
                iconName = 'car-outline';
              } else if (route.name === 'Abastecidas') {
                iconName = 'water-outline';
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
            component={ViagensScreen}
          />

          <Tab.Screen
            name="Abastecidas"
            component={CombustivelScreen}
          />

          <Tab.Screen
            name="Meu faturamento"
            component={FaturamentoScreen}
          />
          
          
        </Tab.Navigator>
      )}
      </Stack.Screen> 

        <Stack.Screen
            name="NovaViagem"
            component={NvViagenScreen}
            options={{ title: 'Nova viagem' }}/>

        <Stack.Screen
            name="NovaAbastecida"
            component={NvAbastecidaScreen}
            options={{ title: 'Nova abastecida' }}/>
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
