import axios from "@/utils/axios";

// 查询员工列表
export const getEmpList = (params) => {
  return axios.get("/emps", { params });
};

// 新增员工
export const addEmp = (data) => {
  return axios.post("/emps", data);
};

// 修改员工
export const updateEmp = (data) => {
  return axios.put("/emps", data);
};

// 删除员工（单个/批量共用同一接口，传 ids 数组）
export const deleteEmp = (id) => {
  return axios.delete("/emps", { params: { ids: [id] } });
};

// 批量删除员工
export const deleteEmps = (ids) => {
  return axios.delete("/emps", { params: { ids } });
};

// 查询部门列表（用于下拉框）
export const getDeptList = () => {
  return axios.get("/depts");
};
