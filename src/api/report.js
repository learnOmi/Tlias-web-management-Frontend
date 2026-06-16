import axios from "@/utils/axios";

// 员工性别统计
export const getEmpGenderData = () => {
  return axios.get("/report/empGenderData");
};

// 员工职位人数统计
export const getEmpJobData = () => {
  return axios.get("/report/empJobData");
};

// 学员学历统计
export const getStudentDegreeData = () => {
  return axios.get("/report/studentDegreeData");
};

// 班级人数统计
export const getStudentCountData = () => {
  return axios.get("/report/studentCountData");
};
