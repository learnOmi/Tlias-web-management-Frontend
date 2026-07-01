<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
import { EditPen, SwitchButton } from "@element-plus/icons-vue";
import PasswordDialog from "./PasswordDialog.vue";
import { useUserStore } from "@/stores";

const route = useRoute();
const userStore = useUserStore();

// 修改密码对话框
const showPwdDialog = ref(false);

// 打开修改密码对话框
const handleOpenPwdDialog = () => {
  showPwdDialog.value = true;
};

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm("确定要退出登录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
  } catch {
    return;
  }
  // 使用 Pinia 的 logout 方法（已包含清除数据和跳转逻辑）
  // logout 方法内部会清除 token、userInfo、roles、permissions，并跳转到登录页
  userStore.setToken("");
  userStore.setUserInfo({ id: null, username: "", name: "", avatar: "" });
  userStore.setRoles([]);
  userStore.setPermissions([]);
  // 直接跳转，logout 方法内部的 useRouter 在 setup 外部调用会有问题
  window.location.href = "/login";
};

// 菜单数据
const menuData = ref([
  {
    name: "首页",
    path: "/index",
    icon: "HomeFilled",
  },
  {
    name: "系统信息管理",
    icon: "Setting",
    children: [
      { name: "部门管理", path: "/dept", icon: "OfficeBuilding" },
      { name: "员工管理", path: "/emp", icon: "User" },
    ]
  },
  {
    name: "班级学员管理",
    icon: "School",
    children: [
      { name: "班级管理", path: "/clazz", icon: "Grid" },
      { name: "学生管理", path: "/stu", icon: "UserFilled" },
    ],
  },
  {
    name: "数据统计管理",
    icon: "DataLine",
    children: [
      { name: "员工报表", path: "/report/emp", icon: "TrendCharts" },
      { name: "学生报表", path: "/report/stu", icon: "TrendCharts" },
      { name: "日志报表", path: "/report/log", icon: "Document" },
    ],
  },
]);

// 当前激活的菜单路径
const activeMenu = ref(route.path);
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Tlias智能学习辅助系统</span>
        <span class="right_tool">
          <a @click="handleOpenPwdDialog" style="cursor: pointer">
            <el-icon>
              <EditPen />
            </el-icon>
            修改密码 &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
          </a>
          <a @click="handleLogout" style="cursor: pointer">
            <el-icon>
              <SwitchButton />
            </el-icon>
            退出登录
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
          <router-view />
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
