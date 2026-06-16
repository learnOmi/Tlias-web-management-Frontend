import axios from "@/utils/axios";

// 员工登录
export const login = (data) => {
  return axios.post("/login", data);
};
