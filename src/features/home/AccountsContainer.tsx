import React, { useRef, useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import { getAccounts } from "@/db/queries/accounts";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useTranslation } from "react-i18next";
import { Account } from "@/db/schema";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import useDatabase from "@/hooks/useDatabase";
import AccountBottomSheet from "./AccountBottomSheet";
import { cn } from "@/utils";
import { COLORS } from "@/theme";

const AccountsContainer = () => {
  const drizzleDB = useDatabase();
  const { data: accounts } = useLiveQuery(getAccounts(drizzleDB));
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handlePress = (account: Account) => {
    setSelectedAccount(account);
    bottomSheetModalRef.current?.present();
  };

  const handleAddAccount = () => {
    setSelectedAccount(null);
    bottomSheetModalRef.current?.present();
  };

  return (
    <>
      <View
        className={cn(
          "bg-containerBackground-light dark:bg-containerBackground-dark",
          "p-padding-default gap-gap-lg rounded-b-2xl",
          "shadow-md"
        )}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-text-2xl text-textPrimary-light dark:text-textPrimary-dark">
            {t("accounts.title")}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {accounts.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => handlePress(item)}
              delayLongPress={500}
              className={cn(
                "bg-primary rounded-lg items-center mr-margin-md",
                "p-padding-default"
              )}
            >
              <Text className="text-text-default text-white">{item.name}</Text>
              <Text className="text-text-lg font-bold text-white">
                €{item.balance}
              </Text>
            </Pressable>
          ))}

          <Pressable
            onPress={handleAddAccount}
            className="border border-primary rounded-lg justify-center items-center"
          >
            <FontAwesome5
              className="p-padding-lg"
              name="plus"
              size={20}
              style={{ color: COLORS["primary"] }}
            />
          </Pressable>
        </ScrollView>
      </View>

      <AccountBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        account={selectedAccount}
        onSave={() => {
          setSelectedAccount(null);
        }}
      />
    </>
  );
};

export default AccountsContainer;
