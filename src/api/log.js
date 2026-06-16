import axios from "@/utils/axios";

// 日志分页查询
export const getLogList = (params) => {
  return axios.get("/log/page", { params });
};
