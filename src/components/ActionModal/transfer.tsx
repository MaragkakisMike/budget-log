import { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { Account } from "@/db/schema";
import { FormTextInput } from "@/components/FormComponents/input";
import { FormDatePicker } from "@/components/FormComponents/datePicker";
import { useTranslation } from "react-i18next";
import FormChipSelector from "@/components/FormComponents/chipSelector";
import { cn } from "@/utils";
import { actionClasses } from "./actionClasses";
import { COLORS } from "@/theme";

interface TransferFormProps {
  control: any;
  errors: any;
  accounts?: Account[];
  isEditing: boolean;
  watch: any;
  setValue: any;
  setError: any;
  clearErrors: any;
}

function TransferForm({
  control,
  errors,
  accounts = [],
  isEditing,
  watch,
  setValue,
  setError,
  clearErrors,
}: TransferFormProps) {
  const { t } = useTranslation();

  const hasEnoughAccounts = accounts.length >= 2;
  const [notEnoughAccountsError, setNotEnoughAccountsError] = useState<
    string | null
  >(!hasEnoughAccounts ? t("form.error.notEnoughAccounts") : null);

  const fromAccountId = watch("fromAccountId");
  const toAccountId = watch("toAccountId");

  useEffect(() => {
    setNotEnoughAccountsError(
      !hasEnoughAccounts ? t("form.error.notEnoughAccounts") : null
    );
  }, [accounts.length, hasEnoughAccounts, t]);

  // const validateAccounts = () => {
  //   if (fromAccountId && toAccountId && fromAccountId === toAccountId) {
  //     setError("toAccountId", {
  //       type: "manual",
  //       message: t("form.error.sameAccount"),
  //     });
  //     return false;
  //   }
  //   return true;
  // };

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
    <View className={actionClasses.formScrollView}>
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
        disabled={!hasEnoughAccounts || !isEditing}
      />

      <FormTextInput
        control={control}
        name="title"
        label={t("form.label.title")}
        placeholder={t("form.placeholder.title")}
        error={errors.title}
        rules={{ required: t("form.error.title") }}
        disabled={!hasEnoughAccounts || !isEditing}
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
        disabled={!hasEnoughAccounts || !isEditing}
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
        disabled={!hasEnoughAccounts || !isEditing}
      />

      <FormDatePicker
        control={control}
        name="date"
        label={t("form.date")}
        error={errors.date}
        disabled={!hasEnoughAccounts || !isEditing}
      />
    </View>
  );
}

export default TransferForm;
