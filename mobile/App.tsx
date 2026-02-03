import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Test Supabase connection
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('_test').select('*').limit(1);
        if (error && error.message.includes('does not exist')) {
          // Table doesn't exist, but connection works!
          setConnected(true);
        } else {
          setConnected(true);
        }
      } catch (err) {
        setError('Connection failed');
        console.error(err);
      }
    };

    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥊 Mustafa's Boxing</Text>
      <Text style={styles.item}>✅ React Native + Expo</Text>
      <Text style={styles.item}>
        {connected ? '✅ Supabase Connected' : error ? '❌ ' + error : '⏳ Connecting...'}
      </Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 30,
  },
  item: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 5,
  },
});
