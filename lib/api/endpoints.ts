export const API = {
  USER: {
    REGISTER: "/api/user/register",
    LOGIN: "/api/user/login",
    GET_ALL: "/api/user",
    GET_PROFILE: (id: string) => `/api/user/${id}`,
  },
  BUSINESS: {
    REGISTER: "/api/business/register",
    LOGIN: "/api/business/login",
    GET_ALL: "/api/business/admin/all",
    UPLOAD_DOC: "/api/business/upload-document",
    APPROVE: (id: string) => `/api/business/admin/approve/${id}`,
  },
};
