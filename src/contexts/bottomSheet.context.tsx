import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  FC,
} from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface BottomSheetContextValue {
  ref: React.RefObject<BottomSheetModal>;
  isOpen: boolean;
  onSheetOpen: () => void;
  onSheetClose: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export const BottomSheetProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<BottomSheetModal>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onSheetOpen = useCallback(() => {
    ref.current?.present();
    setIsOpen(true);
  }, []);

  const onSheetClose = useCallback(() => {
    ref.current?.dismiss();
    setIsOpen(false);
  }, []);

  return (
    <BottomSheetContext.Provider
      value={{ ref, isOpen, onSheetOpen, onSheetClose }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context)
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  return context;
};
