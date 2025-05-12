import { useContext, useEffect } from "react";
import styles from "./Analytics.module.scss";
import DataContext from "../../context";
import HomePageTopMenu from "../../ui/HomePageTopMenu/HomePageTopMenu";
import {
  GetAllCategory,
  getAllClients,
  GetAllDish,
  GetAllService,
  GetOrders,
} from "../../API/ApiReguest";
import { useQuery } from "@tanstack/react-query";
import ReactECharts from "echarts-for-react";
// ... импорт остаётся тем же

function Analytics() {
  const context = useContext(DataContext);

  useEffect(() => {
    context.setSelectedRows([]);
    context.setActiveTable("Analytics");
    context.getTableData("Analytics");
  }, []);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: GetOrders,
    staleTime: Infinity,
  });
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: GetAllService,
    staleTime: Infinity,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: GetAllCategory,
    staleTime: Infinity,
  });
  const { data: dishes = [] } = useQuery({
    queryKey: ["dishes"],
    queryFn: GetAllDish,
    staleTime: Infinity,
  });
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
    staleTime: Infinity,
  });

  const mainChart = {
    title: { text: "Общая аналитика по данным" },
    tooltip: {},
    xAxis: {
      type: "category",
      data: ["Услуги", "Блюда", "Категории", "Клиенты", "Заказы"],
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Количество",
        type: "bar",
        data: [
          services?.data?.length || 0,
          dishes?.data?.length || 0,
          categories?.data?.length || 0,
          clients?.data?.length || 0,
          orders?.data?.length || 0,
        ],
        itemStyle: { color: "#4CAF50" },
      },
    ],
  };

  const serviceRevenue =
    services?.data?.map((s) => ({
      name: s.name,
      value: parseFloat(s.price || 0),
    })) || [];

  const dishRevenue =
    dishes?.data?.map((d) => ({
      name: d.name,
      value: parseFloat(d.price || 0),
    })) || [];

  const categoryChart = {
    title: { text: "Категории блюд" },
    tooltip: {},
    xAxis: {
      type: "category",
      data: categories?.data?.map((c) => c.name),
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Количество блюд",
        type: "bar",
        data: categories?.data?.map(
          (cat) =>
            dishes?.data?.filter((d) => d.categoryId === cat.id).length || 0
        ),
        itemStyle: { color: "#2196F3" },
      },
    ],
  };

  const serviceRevenueChart = {
    title: { text: "Доход от услуг" },
    tooltip: { trigger: "item" },
    legend: { top: "bottom" },
    series: [
      {
        name: "Доход",
        type: "pie",
        radius: ["40%", "70%"],
        data: serviceRevenue,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const dishRevenueChart = {
    title: { text: "Доход от блюд" },
    tooltip: { trigger: "item" },
    legend: { top: "bottom" },
    series: [
      {
        name: "Доход",
        type: "pie",
        radius: ["40%", "70%"],
        data: dishRevenue,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <div className={styles.Analytics}>
      <HomePageTopMenu />

      <div className={styles.Analytics__block}>
        <h2>Аналитика</h2>
        <div className={styles.box}>
          <ReactECharts option={mainChart} style={{ height: 400 }} />
        </div>
        <div className={styles.box}>
          <ReactECharts option={categoryChart} style={{ height: 400 }} />
        </div>

        <div className={styles.box}>
          <ReactECharts option={serviceRevenueChart} style={{ height: 400 }} />
        </div>

        <div className={styles.box}>
          <ReactECharts option={dishRevenueChart} style={{ height: 400 }} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
