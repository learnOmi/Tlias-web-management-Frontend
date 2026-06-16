<script setup>
import { ref, onMounted } from "vue";
import { ElCard } from "element-plus";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { getStudentDegreeData, getStudentCountData } from "@/api/report";

use(CanvasRenderer);
use(BarChart);
use(TitleComponent);
use(TooltipComponent);
use(GridComponent);

// 学历图表配置
const degreeOption = ref({});
// 班级人数图表配置
const clazzOption = ref({});

// 加载数据
const loadData = async () => {
  // 学员学历统计
  const degreeRes = await getStudentDegreeData();
  const degreeData = degreeRes.data || [];
  degreeOption.value = {
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
      data: degreeData.map((item) => item.name),
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
        data: degreeData.map((item) => item.value),
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

  // 班级人数统计
  const countRes = await getStudentCountData();
  const countResData = countRes.data || {};
  const clazzList = countResData.clazzList || [];
  const clazzData = countResData.dataList || [];
  clazzOption.value = {
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
      data: clazzList,
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
        data: clazzData,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#67c23a" },
              { offset: 1, color: "#b3e19a" },
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
      <h2>学员信息统计</h2>
    </div>

    <el-card shadow="never" class="chart-card">
      <template #header>
        <span>学员学历分布</span>
      </template>
      <v-chart :option="degreeOption" class="chart" autoresize />
    </el-card>

    <el-card shadow="never" class="chart-card">
      <template #header>
        <span>班级人数分布</span>
      </template>
      <v-chart :option="clazzOption" class="chart" autoresize />
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
