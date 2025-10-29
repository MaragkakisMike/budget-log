import { View } from "react-native";

import { Account } from "@/db/schema";
import { FormTextInput } from "@/components/FormComponents/input";
import { FormDatePicker } from "@/components/FormComponents/datePicker";
import { useTranslation } from "react-i18next";
import FormChipSelector from "@/components/FormComponents/chipSelector";

import { actionClasses } from "./actionClasses";
import { COLORS } from "@/theme";

interface IncomeFormProps {
  control: any;
  errors: any;
  accounts?: Account[];
  isEditing: boolean;
}

function IncomeForm({
  control,
  errors,
  accounts = [],
  isEditing,
}: IncomeFormProps) {
  const { t } = useTranslation();

  return (
    <View className={actionClasses.formScrollView}>
      <FormTextInput
        control={control}
        name="amount"
        label={t("form.amount")}
        placeholder="0.00"
        keyboardType="numeric"
        error={errors.amount}
        editable={isEditing}
        rules={{
          required: t("form.error.amount"),
          validate: (value) =>
            isNaN(Number(value))
              ? t("form.error.not_number")
              : Number(value) > 0 || t("form.error.less_than_zero"),
        }}
      />

      <FormTextInput
        control={control}
        name="title"
        label={t("form.label.title")}
        placeholder={t("form.placeholder.title")}
        error={errors.title}
        editable={isEditing}
        rules={{ required: t("form.error.title") }}
      />

      <FormChipSelector
        label={t("form.label.account")}
        chips={accounts.map((acc) => ({
          label: acc.name,
          value: acc.id,
          color: COLORS["primary"],
        }))}
        control={control}
        name="accountId"
        rules={{ required: t("form.error.account") }}
        error={errors.accountId}
        disabled={!isEditing}
      />

      <FormDatePicker
        control={control}
        name="date"
        label={t("form.date")}
        error={errors.date}
        disabled={!isEditing}
      />
    </View>
  );
}

export default IncomeForm;
