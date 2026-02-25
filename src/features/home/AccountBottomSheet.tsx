import { useEffect, FC, useState } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  createAccount,
  deleteAccount,
  updateAccount,
} from "@/db/mutations/accounts";
import useDatabase from "@/hooks/useDatabase";
import { BottomSheet } from "@/components/BottomSheet";
import { FormTextInput } from "@/components/FormComponents/input";
import { Account } from "@/db/schema";
import { ActionButtons } from "@/components/ActionButtons";
import { useBottomSheet } from "@/contexts/bottomSheet.context";

interface AccountBottomSheetProps {
  account?: Account | null;
  onSave?: () => void;
}

type AccountFormData = {
  name: string;
  balance: string;
};

export const AccountBottomSheet: FC<AccountBottomSheetProps> = ({
  account,
  onSave,
}) => {
  const drizzleDB = useDatabase();
  const { t } = useTranslation();
  const { onSheetClose, isOpen } = useBottomSheet();
  const isViewMode = !!account;
  const [isEditing, setIsEditing] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    defaultValues: {
      name: "",
      balance: "",
    },
  });

  useEffect(() => {
    if (account) {
      reset({
        name: account.name,
        balance: account.balance.toString(),
      });
      setIsEditing(false);
    } else {
      reset({ name: "", balance: "" });
      setIsEditing(true);
    }
  }, [account, reset, isOpen]);

  const onSubmit = (data: AccountFormData) => {
    const balance = parseFloat(data.balance);

    if (isViewMode && account) {
      updateAccount(drizzleDB, account.id, {
        name: data.name,
        balance,
      });
    } else {
      createAccount(drizzleDB, { name: data.name, balance });
    }

    reset();
    setIsEditing(false);
    if (onSave) onSave();
    onSheetClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (account) {
      deleteAccount(drizzleDB, account.id);
      if (onSave) onSave();
      onSheetClose();
    }
  };

  const handleCancel = () => {
    if (account) {
      reset({
        name: account.name,
        balance: account.balance.toString(),
      });
      setIsEditing(false);
    } else {
      onSheetClose();
    }
  };

  return (
    <BottomSheet
      title={
        isViewMode
          ? isEditing
            ? t("accounts.edit_account")
            : t("accounts.account_details")
          : t("accounts.add_account")
      }
    >
      <FormTextInput
        control={control}
        name="name"
        label={t("accounts.account_name")}
        placeholder={t("accounts.placeholders.account_name")}
        rules={{ required: t("accounts.error.name_required") }}
        error={errors.name}
        editable={isEditing}
      />

      <FormTextInput
        control={control}
        name="balance"
        label={t("accounts.initial_value")}
        placeholder={t("accounts.placeholders.initial_value")}
        keyboardType="numeric"
        rules={{
          required: t("accounts.error.balance_required"),
          validate: (value) =>
            isNaN(Number(value))
              ? t("accounts.error.invalid_number")
              : Number(value) >= 0 || t("accounts.error.negative_balance"),
        }}
        error={errors.balance}
        editable={isEditing}
      />

      <View className="mt-margin-lg">
        {!isEditing && isViewMode ? (
          <ActionButtons
            buttons={[
              {
                title: t("actions.delete"),
                onPress: handleDelete,
                variant: "outlineDanger",
              },
              {
                title: t("actions.edit"),
                onPress: handleEdit,
                variant: "primary",
              },
            ]}
          />
        ) : (
          <ActionButtons
            buttons={[
              {
                title: t("actions.cancel"),
                onPress: handleCancel,
                variant: "outline",
              },
              {
                title: t("actions.save"),
                onPress: handleSubmit(onSubmit),
                variant: "primary",
              },
            ]}
          />
        )}
      </View>
    </BottomSheet>
  );
};

export default AccountBottomSheet;
