import axios from '@/utils/axios'

// 查询部门列表
export const getDeptList = () => {
  return axios.get('/depts')
}

// 根据ID查询部门
export const getDeptById = (id) => {
  return axios.get(`/depts/${id}`)
}

// 新增部门
export const addDept = (data) => {
  return axios.post('/depts', data)
}

// 修改部门
export const updateDept = (data) => {
  return axios.put('/depts', data)
}

// 删除部门
export const deleteDept = (id) => {
  return axios.delete(`/depts/${id}`)
}