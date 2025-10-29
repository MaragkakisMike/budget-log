import Container from "@/components/Container";
import { FC, useCallback, useState, useMemo } from "react";
import PieChartExpenses from "@/features/analysis/PieChartExpenses";
import useDatabase from "@/hooks/useDatabase";
import { useAnalysis } from "@/hooks/useAnalysis";
import ContentDeviderShowHistoryButton from "@/components/ContentDeviderShowHistoryButton";
import { YearSelector } from "@/features/analysis/YearSelector";
import HistoryContainer from "@/features/home/historyContainer";
import { useTransactions } from "@/hooks/useTransactions";
import { View } from "react-native";

const Analysis: FC = () => {
  const drizzleDB = useDatabase();
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const { transactions, transfers } = useTransactions({ year: selectedYear });
  const { availableYears } = useAnalysis(drizzleDB, {
    year: selectedYear,
    includeAllYears: true,
  });
  const years = useMemo(() => {
    return availableYears || [];
  }, [availableYears]);

  const handleHistoryVisibility = useCallback(() => {
    setIsHistoryVisible((prev) => !prev);
  }, []);

  const handleYearSelection = useCallback((year: number) => {
    setSelectedYear(year);
    setIsHistoryVisible(false);
  }, []);

  return (
    <Container>
      <YearSelector
        years={years}
        selectedYear={selectedYear}
        handleYearSelection={handleYearSelection}
      />
      <PieChartExpenses transactions={transactions} />
      <ContentDeviderShowHistoryButton
        isVisible={isHistoryVisible}
        toggleVisibility={handleHistoryVisibility}
      />
      {isHistoryVisible ? (
        <View className="px-padding-md gap-gap-md">
          <HistoryContainer
            transactions={transactions}
            transfers={transfers}
            selectedAction={undefined}
          />
        </View>
      ) : null}
    </Container>
  );
};

export default Analysis;
