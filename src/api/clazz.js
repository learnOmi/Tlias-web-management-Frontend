import axios from "@/utils/axios";

// 查询班级列表（条件分页）
export const getClassList = (params) => {
  return axios.get("/clazzs", { params });
};

// 查询所有班级（用于下拉框）
export const getAllClazzList = () => {
  return axios.get("/clazzs/list");
};

// 新增班级
export const addClazz = (data) => {
  return axios.post("/clazzs", data);
};

// 修改班级
export const updateClazz = (data) => {
  return axios.put("/clazzs", data);
};

// 删除班级
export const deleteClazz = (id) => {
  return axios.delete(`/clazzs/${id}`);
};

// 根据ID查询班级详情
export const getClassById = (id) => {
  return axios.get(`/clazzs/${id}`);
};
