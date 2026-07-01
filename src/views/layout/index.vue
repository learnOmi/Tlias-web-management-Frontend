<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { EditPen, SwitchButton, Rank } from "@element-plus/icons-vue";
import PasswordDialog from "./PasswordDialog.vue";
import { useUserStore, useAppStore } from "@/stores";
import { useGlobalShortcuts } from "@/composables/useShortcuts";
import { useI18n } from "vue-i18n";
import { setLocale } from "@/locales";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const { t, locale } = useI18n();

const cachedViews = computed(() => appStore.cachedViews);

useGlobalShortcuts();

const showPwdDialog = ref(false);
const langDropdownVisible = ref(false);

const currentLangLabel = computed(() => {
  return locale.value === "zh-CN" ? "中文" : "English";
});

const languageOptions = [
  { label: "中文", value: "zh-CN" },
  { label: "English", value: "en-US" },
];

function handleLanguageChange(lang: "zh-CN" | "en-US") {
  setLocale(lang);
  appStore.setLanguage(lang);
}

const handleOpenPwdDialog = () => {
  showPwdDialog.value = true;
};

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(t("header.confirmLogout"), t("common.tips"), {
      confirmButtonText: t("common.confirm"),
      cancelButtonText: t("common.cancel"),
      type: "warning",
    });
  } catch {
    return;
  }
  userStore.setToken("");
  userStore.setUserInfo({ id: null, username: "", name: "", avatar: "" });
  userStore.setRoles([]);
  userStore.setPermissions([]);
  window.location.href = "/login";
};

const activeMenu = ref(route.path);

const menuData = computed(() => [
  {
    name: t("menu.home"),
    path: "/index",
    icon: "HomeFilled",
  },
  {
    name: t("menu.systemManagement"),
    icon: "Setting",
    children: [
      { name: t("menu.deptManagement"), path: "/dept", icon: "OfficeBuilding" },
      { name: t("menu.empManagement"), path: "/emp", icon: "User" },
    ],
  },
  {
    name: t("menu.classStudentManagement"),
    icon: "School",
    children: [
      { name: t("menu.classManagement"), path: "/clazz", icon: "Grid" },
      { name: t("menu.studentManagement"), path: "/stu", icon: "UserFilled" },
    ],
  },
  {
    name: t("menu.dataStatistics"),
    icon: "DataLine",
    children: [
      { name: t("menu.empReport"), path: "/report/emp", icon: "TrendCharts" },
      {
        name: t("menu.studentReport"),
        path: "/report/stu",
        icon: "TrendCharts",
      },
      { name: t("menu.logReport"), path: "/report/log", icon: "Document" },
    ],
  },
]);
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">{{ $t("login.title") }}</span>
        <span class="right_tool">
          <el-dropdown trigger="click" @command="handleLanguageChange">
            <a style="cursor: pointer">
              <el-icon><Rank /></el-icon>
              {{ currentLangLabel }}
              &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
            </a>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="opt in languageOptions"
                  :key="opt.value"
                  :command="opt.value"
                >
                  {{ opt.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <a @click="handleOpenPwdDialog" style="cursor: pointer">
            <el-icon>
              <EditPen />
            </el-icon>
            {{ $t("header.changePassword") }} &nbsp;&nbsp;&nbsp; |
            &nbsp;&nbsp;&nbsp;
          </a>
          <a @click="handleLogout" style="cursor: pointer">
            <el-icon>
              <SwitchButton />
            </el-icon>
            {{ $t("header.logout") }}
          </a>
        </span>
      </el-header>

      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="220px" class="aside">
          <!-- 配置:router后 Element Plus 会自动使用 Vue Router 进行路由跳转 -->
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical"
            :router="true"
          >
            <template v-for="item in menuData" :key="item.path || item.name">
              <!-- 带子菜单的菜单组 -->
              <el-sub-menu v-if="item.children" :index="item.name">
                <template #title>
                  <el-icon>
                    <component :is="item.icon" />
                  </el-icon>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item
                  v-for="child in item.children"
                  :key="child.path"
                  :index="child.path"
                >
                  <el-icon>
                    <component :is="child.icon" />
                  </el-icon>
                  <span>{{ child.name }}</span>
                </el-menu-item>
              </el-sub-menu>
              <!-- 单个菜单项 -->
              <el-menu-item v-else :index="item.path">
                <el-icon>
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>

        <el-main class="main">
          <router-view v-slot="{ Component, route: routeObj }">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="routeObj.fullPath" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>

    <PasswordDialog v-model="showPwdDialog" />
  </div>
</template>

<style scoped>
.header {
  background-image: linear-gradient(
    to right,
    #00547d,
    #007fa4,
    #00aaa0,
    #00d072,
    #a8eb12
  );
}

.title {
  color: white;
  font-size: 40px;
  font-family: 楷体;
  line-height: 60px;
  font-weight: bolder;
}

.right_tool {
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: calc(100vh - 60px);
}

.main {
  background-color: #f5f5f5;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>
