import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 数据字典 Store
 * 缓存系统中的枚举值、字典数据
 */
export const useDictStore = defineStore('dict', () => {
  // ========== State ==========

  // 字典数据缓存（按类型分组）
  const dictData = ref({
    // 员工职位
    emp_job: [
      { label: '班主任', value: 1 },
      { label: '讲师', value: 2 },
      { label: '学工主管', value: 3 },
      { label: '教研主管', value: 4 },
      { label: '咨询师', value: 5 }
    ],
    // 学生学历
    stu_degree: [
      { label: '初中', value: 1 },
      { label: '高中', value: 2 },
      { label: '大专', value: 3 },
      { label: '本科', value: 4 },
      { label: '硕士', value: 5 },
      { label: '博士', value: 6 }
    ],
    // 性别
    gender: [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ]
  })

  // 是否已加载（后续对接后端接口时使用）
  const isLoaded = ref(false)

  // ========== Actions ==========

  /**
   * 根据字典类型获取字典列表
   * @param {string} type - 字典类型
   * @returns {Array}
   */
  const getDictByType = (type) => {
    return dictData.value[type] || []
  }

  /**
   * 根据字典类型和值获取显示文本
   * @param {string} type - 字典类型
   * @param {number|string} value - 字典值
   * @returns {string}
   */
  const getDictLabel = (type, value) => {
    const list = getDictByType(type)
    const item = list.find(d => d.value === value)
    return item ? item.label : ''
  }

  /**
   * 设置字典数据
   * @param {string} type
   * @param {Array} data
   */
  const setDictData = (type, data) => {
    dictData.value[type] = data
  }

  /**
   * 批量设置字典数据
   * @param {object} data
   */
  const setAllDictData = (data) => {
    dictData.value = { ...dictData.value, ...data }
    isLoaded.value = true
  }

  /**
   * 清除字典缓存
   */
  const clearDictData = () => {
    dictData.value = {}
    isLoaded.value = false
  }

  /**
   * 从后端加载字典数据（后续对接）
   * @returns {Promise}
   */
  const loadDictFromServer = async () => {
    // TODO: 对接后端 /dicts 接口
    // const res = await getDictList()
    // setAllDictData(res.data)
    isLoaded.value = true
  }

  return {
    // State
    dictData,
    isLoaded,

    // Actions
    getDictByType,
    getDictLabel,
    setDictData,
    setAllDictData,
    clearDictData,
    loadDictFromServer
  }
}, {
  // 持久化配置
  persist: {
    key: 'tlias-dict',
    storage: localStorage,
    paths: ['dictData', 'isLoaded']
  }
})