<script setup>
import { ref, onMounted } from "vue";
import { ElCard } from "element-plus";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { getEmpGenderData, getEmpJobData } from "@/api/report";

use(CanvasRenderer);
use(BarChart);
use(PieChart);
use(TitleComponent);
use(TooltipComponent);
use(LegendComponent);
use(GridComponent);

// 性别图表配置
const genderOption = ref({});
// 职位图表配置
const jobOption = ref({});

// 加载数据
const loadData = async () => {
  // 员工性别统计
  const genderRes = await getEmpGenderData();
  const genderData = genderRes.data || [];
  genderOption.value = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "0%",
    },
    series: [
      {
        name: "员工性别",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: genderData.map((item) => ({
          name: item.name,
          value: item.value,
        })),
      },
    ],
  };

  // 员工职位统计
  const jobRes = await getEmpJobData();
  const jobResData = jobRes.data || {};
  const jobList = jobResData.jobList || [];
  const dataList = jobResData.dataList || [];
  jobOption.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: jobList,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "人数",
        type: "bar",
        barWidth: "60%",
        data: dataList,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#409eff" },
              { offset: 1, color: "#79bbff" },
            ],
          },
        },
      },
    ],
  };
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="report-container">
    <div class="header">
      <h2>员工信息统计</h2>
    </div>

    <el-card shadow="never" class="chart-card">
      <template #header>
        <span>员工性别分布</span>
      </template>
      <v-chart :option="genderOption" class="chart" autoresize />
    </el-card>

    <el-card shadow="never" class="chart-card">
      <template #header>
        <span>员工职位分布</span>
      </template>
      <v-chart :option="jobOption" class="chart" autoresize />
    </el-card>
  </div>
</template>

<style scoped>
.report-container {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  padding-left: 10px;
  border-left: 4px solid #20a0ff;
}

.chart-card {
  margin-bottom: 16px;
}

.chart-card :deep(.el-card__header) {
  font-weight: 600;
  font-size: 16px;
}

.chart {
  width: 100%;
  height: 350px;
}
</style>
