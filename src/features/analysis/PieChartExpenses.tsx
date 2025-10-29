import { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import { pie, arc } from "d3-shape";
import CardContainer from "@/components/CardContainer";
import { COLORS, SPACING, TEXT_SIZES } from "@/theme";
import { useTranslation } from "react-i18next";

type Transaction = {
  categoryId: number | null;
  categoryName?: string | null;
  category?: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
  amount: number;
  type: string;
};

type CategorySummary = {
  categoryId: number;
  categoryName: string;
  color: string;
  icon: string;
  totalAmount: number;
  percentage: number;
  type: string;
};

type Props = {
  transactions: Transaction[];
};

const PieChartExpenses: React.FC<Props> = ({ transactions }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const chartSize = screenWidth * 0.8;
  const viewBoxSize = 250;
  const radius = 110;
  const innerRadius = 80;

  const expenseCategories: CategorySummary[] = useMemo(() => {
    const expenses = transactions.filter(
      (tx) => tx.type === "expense" && tx.category
    );

    const grouped = expenses.reduce<Record<number, CategorySummary>>(
      (acc, tx) => {
        const cat = tx.category!;
        if (!acc[cat.id]) {
          acc[cat.id] = {
            categoryId: cat.id,
            categoryName: cat.name,
            color: cat.color,
            icon: cat.icon,
            totalAmount: 0,
            percentage: 0,
            type: tx.type,
          };
        }
        acc[cat.id].totalAmount += tx.amount;
        return acc;
      },
      {}
    );

    const result = Object.values(grouped);
    const totalExpense = result.reduce((sum, c) => sum + c.totalAmount, 0);
    return result.map((c) => ({
      ...c,
      percentage: totalExpense
        ? Math.round((c.totalAmount / totalExpense) * 100)
        : 0,
    }));
  }, [transactions]);

  const totalExpense = useMemo(
    () => expenseCategories.reduce((acc, c) => acc + c.totalAmount, 0),
    [expenseCategories]
  );

  const pieData = pie<CategorySummary>().value((d) => d.totalAmount)(
    expenseCategories
  );

  const arcGenerator = arc()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .padAngle(0.02);

  const handlePress = (categoryId: number) => {
    setSelected((prevSelected) =>
      prevSelected === categoryId ? null : categoryId
    );
  };

  const selectedCategory = useMemo(
    () => expenseCategories.find((cat) => cat.categoryId === selected),
    [selected, expenseCategories]
  );

  return (
    <View
      className="w-full"
      style={{
        paddingHorizontal: parseInt(SPACING["padding-md"]),
      }}
    >
      <CardContainer title={t("transactions.expenses")}>
        {/* Pie Chart */}
        <Svg
          width={chartSize}
          height={chartSize}
          viewBox={`-${viewBoxSize / 2} -${
            viewBoxSize / 2
          } ${viewBoxSize} ${viewBoxSize}`}
        >
          <G>
            {!pieData || pieData.length === 0 ? (
              <Path
                d={arc()
                  .innerRadius(innerRadius)
                  .outerRadius(radius)
                  .startAngle(0)
                  .endAngle(2 * Math.PI)()}
                fill={COLORS.gray}
                opacity={0.2}
              />
            ) : (
              pieData.map((slice) => (
                <Path
                  key={slice.data.categoryId}
                  d={arcGenerator(slice) || ""}
                  fill={slice.data.color}
                  onPressIn={() => handlePress(slice.data.categoryId)}
                  opacity={
                    selected === slice.data.categoryId || !selected ? 1 : 0.3
                  }
                  strokeWidth={1}
                />
              ))
            )}
          </G>

          {/* Center Text */}
          <SvgText
            x={0}
            y={-10}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={parseInt(TEXT_SIZES["text-lg"])}
            fontWeight="bold"
            fill={COLORS["textPrimary-light"]}
          >
            {selectedCategory ? selectedCategory.categoryName : "Total"}
          </SvgText>

          <SvgText
            x={0}
            y={15}
            textAnchor="middle"
            alignmentBaseline="baseline"
            fontSize={parseInt(TEXT_SIZES["text-lg"])}
            fontWeight="bold"
            fill={COLORS["textPrimary-light"]}
          >
            {selectedCategory
              ? `€${selectedCategory.totalAmount}`
              : `€${totalExpense}`}
          </SvgText>

          {/* Tap Area to Reset Selection */}
          <Path
            d={arc()
              .innerRadius(0)
              .outerRadius(70)
              .startAngle(0)
              .endAngle(2 * Math.PI)()}
            fill="transparent"
            onPressIn={() => setSelected(null)}
          />
        </Svg>

        {/* Category Legend */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          {expenseCategories
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .map((item) => (
              <TouchableOpacity
                key={item.categoryId}
                onPress={() => handlePress(item.categoryId)}
                className="flex-row items-center mr-4"
              >
                <View
                  className="rounded-full mr-2"
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: item.color,
                    opacity:
                      selected === item.categoryId || !selected ? 1 : 0.2,
                  }}
                />
                <Text
                  className={`${
                    selected === item.categoryId ? "font-bold" : ""
                  }`}
                  style={{
                    fontSize: parseInt(TEXT_SIZES["text-md"]),
                    color: COLORS["textPrimary-light"],
                  }}
                >
                  {item.categoryName}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </CardContainer>
    </View>
  );
};

export default PieChartExpenses;
