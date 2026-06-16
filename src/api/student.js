import axios from "@/utils/axios";

// 查询学员列表（条件分页）
export const getStudentList = (params) => {
  return axios.get("/students", { params });
};

// 新增学员
export const addStudent = (data) => {
  return axios.post("/students", data);
};

// 修改学员
export const updateStudent = (data) => {
  return axios.put("/students", data);
};

// 删除学员（批量，路径参数）
export const deleteStudent = (ids) => {
  return axios.delete(`/students/${ids}`);
};

// 根据ID查询学员详情
export const getStudentById = (id) => {
  return axios.get(`/students/${id}`);
};

// 修改班级列表（用于下拉框）
export const getAllClazzList = () => {
  return axios.get("/clazzs/list");
};

// 违纪处理
export const putViolation = (id, score) => {
  return axios.put(`/students/violation/${id}/${score}`);
};
