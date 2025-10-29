import SafePageView from "@/components/SafePageView";
import { useLocalSearchParams, useRouter } from "expo-router";
import ExpenseForm from "@/components/ActionModal/expense";
import IncomeForm from "@/components/ActionModal/income";
import TransferForm from "@/components/ActionModal/transfer";
import { getAccounts } from "@/db/queries/accounts";
import { getCategories } from "@/db/queries/categories";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import useDatabase from "@/hooks/useDatabase";
import Container from "@/components/Container";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  createTransaction,
  updateTransaction,
} from "@/db/mutations/transactions";
import { createTransfer, updateTransfer } from "@/db/mutations/transfers";
import useActionStore from "@/stores/actions-store";
import { useColorScheme } from "nativewind";
import React, { useMemo } from "react";
import { Control, FieldErrors, useForm } from "react-hook-form";
import { useFormActionButtons } from "@/hooks/useFormActionButtons";
import { ActionButtons } from "@/components/ActionButtons";
import { t } from "i18next";
import { View, Text, TouchableOpacity } from "react-native";
import { ActionFormData } from "@/types/actions";
import EditModeFloatingChip from "@/features/action/EditModeFloatingChip";

export default function ActionPage() {
  const { action, isEdit } = useLocalSearchParams<{
    action?: string;
    isEdit?: string;
  }>();
  const { colorScheme } = useColorScheme();
  const drizzleDB = useDatabase();
  const { selectedAction } = useActionStore();
  const { data: categories = [] } = useLiveQuery(getCategories(drizzleDB));
  const { data: accounts = [] } = useLiveQuery(getAccounts(drizzleDB));
  const router = useRouter();

  const defaultValues = useMemo(() => {
    const base = {
      amount: selectedAction?.amount || "",
      title: selectedAction?.title || "",
      date: selectedAction?.date || new Date(),
    };

    if (!selectedAction) {
      return {
        ...base,
        categoryId: undefined,
        accountId: undefined,
        fromAccountId: undefined,
        toAccountId: undefined,
      };
    }

    switch (selectedAction.type) {
      case "expense":
        return {
          ...base,
          categoryId: selectedAction.categoryId,
          accountId: selectedAction.accountId,
        };

      case "income":
        return {
          ...base,
          accountId: selectedAction.accountId,
        };

      case "transfer":
        return {
          ...base,
          fromAccountId: selectedAction.fromAccountId,
          toAccountId: selectedAction.toAccountId,
        };

      default:
        return base;
    }
  }, [selectedAction]);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<ActionFormData>({
    defaultValues,
  });

  const { buttons, isEditing } = useFormActionButtons<ActionFormData>({
    item: selectedAction,
    onSave: isEdit ? handleEdit : handleFormSubmit,
    onDelete: () => {},
    onDismiss: handleBackPress,
    handleSubmit,
  });

  function handleFormSubmit(data) {
    const formData = {
      ...data,
      date: data.date.toISOString(),
      type: action,
    };
    if (action === "transfer") {
      formData.fromAccountName =
        accounts.find((acc) => acc.id === data?.fromAccountId)?.name || null;
      formData.toAccountName =
        accounts.find((acc) => acc.id === data?.toAccountId)?.name || null;
      createTransfer(drizzleDB, formData);
    } else {
      formData.categoryId =
        formData.type === "expense" ? data.categoryId || -1 : null;

      formData.accountName =
        accounts.find((acc) => acc.id === data?.accountId)?.name || null;

      formData.categoryName =
        categories.find((cat) => cat.id === data?.categoryId)?.name || null;
      createTransaction(drizzleDB, formData);
    }
    router.back();
  }

  function handleEdit(data) {
    const formData = {
      ...data,
      date: data.date.toISOString(),
      type: action,
    };

    if (action === "transfer") {
      formData.fromAccountName =
        accounts.find((acc) => acc.id === data?.fromAccountId)?.name || null;
      formData.toAccountName =
        accounts.find((acc) => acc.id === data?.toAccountId)?.name || null;

      updateTransfer(drizzleDB, selectedAction.id, formData);
    } else {
      formData.categoryId =
        formData.type === "expense" ? data.categoryId || -1 : null;

      formData.accountName =
        accounts.find((acc) => acc.id === data?.accountId)?.name || null;

      formData.categoryName =
        categories.find((cat) => cat.id === data?.categoryId)?.name || null;
      updateTransaction(drizzleDB, selectedAction.id, formData);
    }

    router.back();
  }
  function handleBackPress() {
    router.back();
  }

  const renderForm = () => {
    const formProps = {
      control: control as Control<ActionFormData>,
      errors: errors as FieldErrors<ActionFormData>,
      categories,
      accounts,
      isEditing,
    };
    const formActions = { setError, clearErrors, watch, setValue };
    switch (action) {
      case "expense":
        return <ExpenseForm {...formProps} />;
      case "income":
        return <IncomeForm {...formProps} />;
      case "transfer":
        return <TransferForm {...{ ...formProps, ...formActions }} />;
      default:
        return null;
    }
  };
  const titleMap = {
    expense: { label: t("transactions.expense"), icon: "arrow-up" },
    income: { label: t("transactions.income"), icon: "arrow-down" },
    transfer: { label: t("transactions.transfer"), icon: "exchange-alt" },
  };

  const { label, icon } = titleMap[action] || {};

  return (
    <SafePageView colorScheme={colorScheme}>
      <Container noRefresh={!isEdit}>
        <View className="p-padding-md flex-1">
          <View className="flex-row items-center justify-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-11 h-11 absolute left-0 items-center justify-center rounded-2xl bg-white shadow-sm active:scale-95"
            >
              <FontAwesome5 name="chevron-left" size={16} color="#1f2937" />
            </TouchableOpacity>

            <View className="flex-row items-center gap-2">
              <View className="w-11 h-11 rounded-2xl bg-primary/30 items-center justify-center shadow-lg">
                <FontAwesome5 name={icon} size={20} color="white" />
              </View>
              <Text className="text-3xl font-black text-gray-900">{label}</Text>
            </View>
          </View>

          <EditModeFloatingChip isVisible={isEditing && !!isEdit} />

          {renderForm()}

          <ActionButtons buttons={buttons} />
        </View>
      </Container>
    </SafePageView>
  );
}
