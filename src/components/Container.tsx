import { ScrollView, RefreshControl, View } from "react-native";
import { cn } from "@/utils";
import { useCallback, useState } from "react";

function Container(props) {
  const [refreshing, setRefreshing] = useState(false);
  const { className, noRefresh } = props;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        !noRefresh && (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        )
      }
    >
      <View
        className={cn(
          "flex-1 gap-gap-default pb-padding-lg bg-background-light dark:bg-background-dark",
          className
        )}
      >
        {props.children}
      </View>
    </ScrollView>
  );
}

export default Container;
