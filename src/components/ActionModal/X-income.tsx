import { View, Text, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { FontAwesome5 } from "@expo/vector-icons";

import { Account, Category } from "@/db/schema";
import { FormTextInput } from "@/components/FormComponents/input";
import { FormDatePicker } from "@/components/FormComponents/datePicker";
import { useTranslation } from "react-i18next";
import { IncomeFormData } from "@/interfaces";
import FormChipSelector from "@/components/FormComponents/chipSelector";

import { actionClasses } from "./actionClasses";
import { COLORS } from "@/theme";
import { ActionButtons } from "../ActionButtons";

interface IncomeFormProps {
  categories: Category[];
  accounts?: Account[];
  initialValues?: Partial<IncomeFormData>;
  onSubmit: (formData: IncomeFormData) => void;
  onBack: () => void;
}

function IncomeForm({
  accounts = [],
  onSubmit,
  onBack,
  initialValues,
}: IncomeFormProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IncomeFormData>({
    defaultValues: {
      amount: initialValues?.amount || "",
      title: initialValues?.title || "",
      accountId: initialValues?.accountId || null,
      date: initialValues?.date || new Date(),
    },
  });

  const onFormSubmit = (data: IncomeFormData) => {
    onSubmit(data);
  };

  return (
    <View className={actionClasses.formContainer}>
      <View className={actionClasses.formHeader}>
        <FontAwesome5
          name="plus-circle"
          size={24}
          style={{ color: COLORS["primary"] }}
        />
        <Text className={actionClasses.formTitle}>
          {t("transactions.income_label")}
        </Text>
      </View>

      <ScrollView className={actionClasses.formScrollView}>
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
        />

        <FormTextInput
          control={control}
          name="title"
          label={t("form.label.title")}
          placeholder={t("form.placeholder.title")}
          error={errors.title}
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
        />

        <FormDatePicker
          control={control}
          name="date"
          label={t("form.date")}
          error={errors.date}
        />
      </ScrollView>

      <ActionButtons
        buttons={[
          {
            title: t("actions.back"),
            onPress: onBack,
            variant: "outline",
          },
          {
            title: t("actions.save"),
            onPress: handleSubmit(onFormSubmit),
            variant: "primary",
          },
        ]}
      />
    </View>
  );
}

export default IncomeForm;
