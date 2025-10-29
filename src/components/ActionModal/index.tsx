import { FontAwesome5 } from "@expo/vector-icons";
import { View, Pressable, Text, Modal } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import useActionStore from "@/stores/actions-store";

import { actionClasses } from "./actionClasses";
import { COLORS } from "@/theme";
import { useCallback } from "react";

function ActionsModal({ isModalVisible, toggleModal }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { invalidateSelectedAction } = useActionStore();

  const handleActionPress = useCallback(
    (action: string) => {
      invalidateSelectedAction();
      toggleModal();
      router.navigate(`/action/${action.toLowerCase()}`);
    },
    [invalidateSelectedAction, router, toggleModal]
  );

  return (
    <Modal
      transparent
      visible={isModalVisible}
      animationType="fade"
      onRequestClose={toggleModal}
    >
      <Pressable className={actionClasses.modalOverlay} onPress={toggleModal}>
        <View className={actionClasses.modalContainer}>
          <View className={actionClasses.modalContent}>
            <View className={actionClasses.actionsContainer}>
              <Pressable
                className={actionClasses.modalButton}
                onPress={() => handleActionPress("Expense")}
              >
                <FontAwesome5
                  name="arrow-up"
                  size={24}
                  style={{ color: COLORS["primary"] }}
                />
                <Text className={actionClasses.modalButtonText}>
                  {t("transactions.expense")}
                </Text>
              </Pressable>

              <Pressable
                className={actionClasses.modalButton}
                onPress={() => handleActionPress("Income")}
              >
                <FontAwesome5
                  name="arrow-down"
                  size={24}
                  style={{ color: COLORS["primary"] }}
                />
                <Text className={actionClasses.modalButtonText}>
                  {t("transactions.income_label")}
                </Text>
              </Pressable>

              <Pressable
                className={actionClasses.modalButton}
                onPress={() => handleActionPress("Transfer")}
              >
                <FontAwesome5
                  name="exchange-alt"
                  size={24}
                  style={{ color: COLORS["primary"] }}
                />
                <Text className={actionClasses.modalButtonText}>
                  {t("transactions.transfer")}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

export default ActionsModal;
