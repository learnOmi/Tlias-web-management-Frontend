export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

export interface PageParams {
  page: number;
  pageSize: number;
}

export interface PageResult<T> {
  total: number;
  rows: T[];
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export interface UserInfo {
  id?: number;
  name?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}

export interface Dept {
  id: number;
  name: string;
  pid?: number;
  children?: Dept[];
  createTime?: string;
}

export interface Emp {
  id: number;
  username: string;
  name: string;
  gender: number;
  phone: string;
  job: number;
  salary: number;
  image: string;
  deptId: number;
  entryDate: string;
  createTime: string;
  updateTime: string;
}

export interface Clazz {
  id: number;
  name: string;
  room: string;
  beginDate: string;
  endDate: string;
  masterId: number;
  masterName?: string;
  createTime: string;
}

export interface Student {
  id: number;
  name: string;
  no: string;
  gender: number;
  phone: string;
  idCard: string;
  isCollege: number;
  address: string;
  degree: number;
  graduationDate: string;
  clazzId: number;
  clazzName?: string;
  createTime: string;
  updateTime: string;
}

export interface Log {
  id: number;
  operateEmpId: number;
  operateTime: string;
  className: string;
  methodName: string;
  methodParams: string;
  returnValue: string;
  costTime: number;
  operateEmpName?: string;
}

export interface ReportData {
  jobList: {
    jobName: string;
    dataList: number[];
  };
  degreeList: {
    degreeName: string;
    dataList: number[];
  };
  studentCount: number;
  classCount: number;
  empCount: number;
  studentGenderList: {
    name: string;
    value: number;
  }[];
}

export interface DictItem {
  label: string;
  value: string | number;
  type?: string;
}
