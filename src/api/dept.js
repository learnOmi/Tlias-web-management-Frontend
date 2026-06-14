import axios from '@/utils/axios'

export const getDeptList = () => {
  return axios.get('/depts')
}