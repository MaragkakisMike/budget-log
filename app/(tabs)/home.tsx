import { useCallback, useState } from "react";
import { View } from "react-native";
import Container from "@/components/Container";
import AccountsContainer from "@/features/home/AccountsContainer";
import IncomeExpensesContainer from "@/features/home/IncomeExpensesContainer";
import HistoryContainer from "@/features/home/historyContainer";
import { useTransactions } from "@/hooks/useTransactions";

const HomePage = () => {
  const [selectedAction, setSelectedAction] = useState<"income" | "expense">();
  const { transactions, transfers } = useTransactions();

  const handleSelectAction = useCallback((action: "income" | "expense") => {
    setSelectedAction((prev) => (prev === action ? undefined : action));
  }, []);

  return (
    <Container>
      <AccountsContainer />
      <View className="px-padding-md gap-gap-md">
        <IncomeExpensesContainer onSelectAction={handleSelectAction} />
        <HistoryContainer
          transactions={transactions}
          transfers={transfers}
          selectedAction={selectedAction}
        />
      </View>
    </Container>
  );
};

export default HomePage;
