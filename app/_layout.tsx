import { Stack } from "expo-router";
import "../global.css";
import { Suspense } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { DATABASE_NAME } from "@/db/client";
import { ActivityIndicator } from "react-native";
import "@/services/i18next";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { db } from "@/db/client";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CategoriesProvider } from "@/contexts/categories/categories-provider";

const StackLayout = () => {
  const { success, error } = useMigrations(db, migrations);
  if (error) {
    console.error(error);
  } else if (success) {
    console.log("Database ran successfully");
  }
  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <GestureHandlerRootView className="flex-1">
        <BottomSheetModalProvider>
          <CategoriesProvider>
            <SQLiteProvider
              databaseName={DATABASE_NAME}
              options={{ enableChangeListener: true }}
              useSuspense
            >
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="action/[action]"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
            </SQLiteProvider>
          </CategoriesProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Suspense>
  );
};

export default StackLayout;
