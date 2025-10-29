import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { FontAwesome5 } from "@expo/vector-icons";

import { Account } from "@/db/schema";
import { FormTextInput } from "@/components/FormComponents/input";
import { FormDatePicker } from "@/components/FormComponents/datePicker";
import { useTranslation } from "react-i18next";
import { TransferFormData } from "@/interfaces";
import FormChipSelector from "@/components/FormComponents/chipSelector";
import { cn } from "@/utils";
import { actionClasses } from "./actionClasses";
import { COLORS } from "@/theme";
import { ActionButtons } from "../ActionButtons";

interface TransferFormProps {
  accounts?: Account[];
  initialValues?: Partial<TransferFormData>;
  onSubmit: (formData: TransferFormData) => void;
  onBack: () => void;
}

function TransferForm({
  accounts = [],
  onSubmit,
  onBack,
  initialValues,
}: TransferFormProps) {
  const { t } = useTranslation();

  const hasEnoughAccounts = accounts.length >= 2;
  const [notEnoughAccountsError, setNotEnoughAccountsError] = useState<
    string | null
  >(!hasEnoughAccounts ? t("form.error.notEnoughAccounts") : null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm<TransferFormData>({
    defaultValues: {
      amount: initialValues?.amount || "",
      title: initialValues?.title || "",
      fromAccountId: initialValues?.fromAccountId || null,
      toAccountId: initialValues?.toAccountId || null,
      date: initialValues?.date || new Date(),
    },
  });

  const fromAccountId = watch("fromAccountId");
  const toAccountId = watch("toAccountId");

  useEffect(() => {
    setNotEnoughAccountsError(
      !hasEnoughAccounts ? t("form.error.notEnoughAccounts") : null
    );
  }, [accounts.length, hasEnoughAccounts, t]);

  const validateAccounts = () => {
    if (fromAccountId && toAccountId && fromAccountId === toAccountId) {
      setError("toAccountId", {
        type: "manual",
        message: t("form.error.sameAccount"),
      });
      return false;
    }
    return true;
  };

  const onFormSubmit = (data: TransferFormData) => {
    if (!hasEnoughAccounts) {
      return;
    }

    if (!validateAccounts()) {
      return;
    }

    onSubmit(data);
  };

  const handleFromAccountChange = (accountId: number) => {
    const newValue = fromAccountId === accountId ? null : accountId;
    setValue("fromAccountId", newValue);

    if (errors.toAccountId?.type === "manual" && newValue !== toAccountId) {
      clearErrors("toAccountId");
    }

    if (newValue && newValue === toAccountId) {
      setError("toAccountId", {
        type: "manual",
        message: t("form.error.sameAccount"),
      });
    }
  };

  const handleToAccountChange = (accountId: number) => {
    const newValue = toAccountId === accountId ? null : accountId;
    setValue("toAccountId", newValue);

    if (errors.toAccountId?.type === "manual" && newValue !== fromAccountId) {
      clearErrors("toAccountId");
    }

    if (newValue && newValue === fromAccountId) {
      setError("toAccountId", {
        type: "manual",
        message: t("form.error.sameAccount"),
      });
    }
  };

  return (
    <View className={actionClasses.formContainer}>
      <View className={actionClasses.formHeader}>
        <FontAwesome5
          name="exchange-alt"
          size={24}
          style={{ color: COLORS["primary"] }}
        />
        <Text className={actionClasses.formTitle}>
          {t("transactions.transfer")}
        </Text>
      </View>

      <ScrollView className={actionClasses.formScrollView}>
        {notEnoughAccountsError && (
          <View className={actionClasses.errorContainer}>
            <Text
              className={cn(actionClasses.errorText, actionClasses.globalError)}
            >
              {notEnoughAccountsError}
            </Text>
          </View>
        )}

        <FormTextInput
          control={control}
          name="amount"
          label={t("form.amount")}
          placeholder="0.00"
          keyboardType="numeric"
          error={errors.amount}
          rules={{
            required: t("form.error.amount"),
            validate: (value) =>
              isNaN(Number(value))
                ? t("form.error.not_number")
                : Number(value) > 0 || t("form.error.less_than_zero"),
          }}
          disabled={!hasEnoughAccounts}
        />

        <FormTextInput
          control={control}
          name="title"
          label={t("form.label.title")}
          placeholder={t("form.placeholder.title")}
          error={errors.title}
          rules={{ required: t("form.error.title") }}
          disabled={!hasEnoughAccounts}
        />

        <FormChipSelector
          label={t("form.label.fromAccount")}
          chips={accounts.map((acc) => ({
            label: acc.name,
            value: acc.id,
            color:
              acc.id === toAccountId ? COLORS["disabled"] : COLORS["primary"],
            disabled: acc.id === toAccountId,
          }))}
          control={control}
          name="fromAccountId"
          rules={{ required: t("form.error.account") }}
          error={errors.fromAccountId}
          onSelect={handleFromAccountChange}
        />

        <FormChipSelector
          label={t("form.label.toAccount")}
          chips={accounts.map((acc) => ({
            label: acc.name,
            value: acc.id,
            color:
              acc.id === fromAccountId ? COLORS["disabled"] : COLORS["primary"],
            disabled: acc.id === fromAccountId,
          }))}
          control={control}
          name="toAccountId"
          rules={{ required: t("form.error.account") }}
          error={errors.toAccountId}
          onSelect={handleToAccountChange}
        />

        <FormDatePicker
          control={control}
          name="date"
          label={t("form.date")}
          error={errors.date}
          disabled={!hasEnoughAccounts}
        />
      </ScrollView>

      <ActionButtons
        buttons={[
          {
            title: t("actions.cancel"),
            onPress: onBack,
            variant: "outline",
          },
          {
            title: t("actions.save"),
            onPress: handleSubmit(onFormSubmit),
            variant: "primary",
            disabled: !hasEnoughAccounts,
          },
        ]}
      />
    </View>
  );
}

export default TransferForm;
