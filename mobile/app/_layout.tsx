import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.background,
                    },
                    headerTintColor: COLORS.text,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: COLORS.background,
                    },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="course/[id]"
                    options={{
                        headerShown: false,
                        headerTitle: '',
                    }}
                />
                <Stack.Screen
                    name="lesson/[id]"
                    options={{
                        headerShown: true,
                        headerTitle: '',
                    }}
                />
            </Stack>
        </>
    );
}
