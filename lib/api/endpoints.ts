// backend route paths

export const API = {
  USER: {
    REGISTER: "/api/user/register",
    LOGIN: "/api/user/login",
  },
  BUSINESS: {
    REGISTER: "/api/business/register",
    LOGIN: "/api/business/login",
    UPLOAD_DOC: "/api/business/upload-document",
    APPROVE: (id: string) => `/api/business/admin/approve/${id}`,
  },
};
