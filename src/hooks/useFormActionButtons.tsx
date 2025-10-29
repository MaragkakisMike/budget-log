import { useState } from "react";
import { UseFormHandleSubmit } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ActionButton = {
  title: string;
  onPress: () => void;
  variant: "primary" | "outline" | "outlineDanger";
};

interface UseFormActionButtonsProps<T> {
  item?: T;
  onSave: (data: T) => void;
  onDelete?: (item: T) => void;
  onDismiss?: () => void;
  handleSubmit: UseFormHandleSubmit<T>;
}

export function useFormActionButtons<T>({
  item,
  onSave,
  onDelete,
  onDismiss,
  handleSubmit,
}: UseFormActionButtonsProps<T>) {
  const { t } = useTranslation();
  const isViewMode = !!item;
  const [isEditing, setIsEditing] = useState(!isViewMode);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (isViewMode) {
      setIsEditing(false);
    } else {
      onDismiss?.();
    }
  };

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item);
      onDismiss?.();
    }
  };

  const handleSave = handleSubmit((data) => {
    onSave(data);
    if (isViewMode) {
      setIsEditing(false);
    } else {
      onDismiss?.();
    }
  });

  const buttons: ActionButton[] =
    !isEditing && isViewMode
      ? [
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
        ]
      : [
          {
            title: t("actions.cancel"),
            onPress: handleCancel,
            variant: "outline",
          },
          {
            title: t("actions.save"),
            onPress: handleSave,
            variant: "primary",
          },
        ];

  return { isEditing, buttons };
}
