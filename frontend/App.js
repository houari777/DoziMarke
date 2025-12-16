// 📱 frontend/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './src/contexts/ThemeContext'; // Corrected path

// الشاشات
import BusinessDashboard from './src/screens/business/BusinessDashboard';
import GamificationDashboard from './src/screens/business/GamificationDashboard';
import ProductManager from './src/screens/business/ProductManager';
import NegotiationHub from './src/screens/business/NegotiationHub';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="BusinessDashboard"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2196F3',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18,
              },
              headerBackTitleVisible: false,
            }}
          >
            <Stack.Screen
              name="BusinessDashboard"
              component={BusinessDashboard}
              options={{ title: 'لوحة التحكم' }}
            />
            <Stack.Screen
              name="GamificationDashboard"
              component={GamificationDashboard}
              options={{ title: 'النظام التلعبيبي' }}
            />
            <Stack.Screen
              name="ProductManager"
              component={ProductManager}
              options={{ title: 'إدارة المنتجات' }}
            />
            <Stack.Screen
              name="NegotiationHub"
              component={NegotiationHub}
              options={{ title: 'مركز التفاوض' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </PaperProvider>
  );
}
