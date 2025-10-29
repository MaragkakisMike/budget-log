import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useForm } from "react-hook-form";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

import { Account, Category } from "@/db/schema";
import { FormTextInput } from "@/components/FormComponents/input";
import { FormDatePicker } from "@/components/FormComponents/datePicker";
import { useTranslation } from "react-i18next";
import { ExpenseFormData } from "@/interfaces";
import { FormChipSelector } from "@/components/FormComponents/chipSelector";

import { actionClasses } from "./actionClasses";
import { COLORS } from "@/theme";
import { ActionButtons } from "../ActionButtons";
import { useFormActionButtons } from "@/hooks/useFormActionButtons";

const EditModeFloatingChip = ({ isVisible }: { isVisible: boolean }) => {
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isVisible, pulseAnim]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        width: 100,
        transform: [{ scale: pulseAnim }],
      }}
      className="bg-primary/60 rounded-full px-3 py-1.5 shadow-lg mb-4"
    >
      <View className="flex-row items-center">
        <FontAwesome5 name="pen" size={10} color="white" />
        <Text className="ml-1 text-white text-xs font-semibold">
          {t("form.editing")}
        </Text>
      </View>
    </Animated.View>
  );
};

interface ExpenseFormProps {
  categories: Category[];
  accounts?: Account[];
  initialValues?: Partial<ExpenseFormData>;
  onSubmit: (formData: ExpenseFormData) => void;
  onBack: () => void;
}

function ExpenseForm({
  categories,
  accounts = [],
  onSubmit,
  onBack,
  initialValues,
}: ExpenseFormProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      amount: initialValues?.amount || "",
      title: initialValues?.title || "",
      categoryId: initialValues?.categoryId || null,
      accountId: initialValues?.accountId || null,
      date: initialValues?.date || new Date(),
    },
  });

  const { buttons, isEditing } = useFormActionButtons<Partial<ExpenseFormData>>(
    {
      item: initialValues,
      onSave: onSubmit,
      onDelete: () => {},
      onDismiss: onBack,
      handleSubmit,
    }
  );

  return (
    <View className={actionClasses.formContainer}>
      {/* Toast notification - appears briefly when edit mode is enabled */}
      {/* <EditModeToast isVisible={isEditing} /> */}

      {/* Floating chip - always visible when in edit mode */}

      <View className="flex-row items-center justify-center mb-6">
        <TouchableOpacity
          onPress={onBack}
          className="w-11 h-11 absolute left-0 items-center justify-center rounded-2xl bg-white shadow-sm active:scale-95"
          activeOpacity={1}
        >
          <FontAwesome5 name="chevron-left" size={16} color="#1f2937" />
        </TouchableOpacity>

        <View className=" flex-row items-center gap-2">
          <View className="w-11 h-11 rounded-2xl bg-primary/30  items-center justify-center shadow-lg">
            <FontAwesome5 name="arrow-down" size={20} color="white" />
          </View>
          <Text className="text-3xl font-black text-gray-900 text-center tracking-tight">
            {t("transactions.expense")}
          </Text>
        </View>
      </View>
      <EditModeFloatingChip isVisible={isEditing} />

      <ScrollView className={actionClasses.formScrollView}>
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
          label={t("form.label.category")}
          chips={categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
            color: cat.color,
          }))}
          control={control}
          name="categoryId"
          disabled={!isEditing}
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
      </ScrollView>

      <ActionButtons buttons={buttons} />
    </View>
  );
}

export default ExpenseForm;
