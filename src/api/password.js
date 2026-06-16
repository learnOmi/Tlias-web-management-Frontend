import axios from "@/utils/axios";

// 修改密码
export const changePwd = (data) => {
  return axios.put("/password", data);
};
