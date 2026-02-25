import { Stack } from "expo-router";
import "../global.css";
import { Suspense, useEffect, useMemo } from "react";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { ActivityIndicator, View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import "@/services/i18next";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { DATABASE_NAME } from "@/db/client";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CategoriesProvider } from "@/contexts/categories.context";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { DrizzleContext } from "@/db/DrizzleContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const checkStoredScheme = async () => {
      const savedScheme = await AsyncStorage.getItem("color-scheme");
      if (savedScheme) {
        setColorScheme(savedScheme as "light" | "dark");
      } else {
        setColorScheme("light");
        await AsyncStorage.setItem("color-scheme", "light");
      }
    };
    checkStoredScheme();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <BottomSheetModalProvider>
              <SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }}
                useSuspense
              >
                <DatabaseSetupWrapper />
              </SQLiteProvider>
            </BottomSheetModalProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </Suspense>
    </SafeAreaProvider>
  );
}

function DatabaseSetupWrapper() {
  const sqlite = useSQLiteContext();
  const drizzleDB = useMemo(() => drizzle(sqlite), [sqlite]);
  const { success, error } = useMigrations(drizzleDB, migrations);

  if (error) {
    console.error(error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error setting up the database.</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <DrizzleContext.Provider value={drizzleDB}>
      <CategoriesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="action/[action]"
            options={{ headerShown: false }}
          />
        </Stack>
      </CategoriesProvider>
    </DrizzleContext.Provider>
  );
}
