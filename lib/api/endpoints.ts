export const API = {
  USER: {
    REGISTER: "/api/user/register",
    LOGIN: "/api/user/login",
    GET_ALL: "/api/user",
    GET_PROFILE: (id: string) => `/api/user/${id}`,
    GET_MY_PROFILE: "/api/user/profile",
    UPDATE_MY_PROFILE: "/api/user/profile",
    REQUEST_PASSWORD_RESET: "/api/user/request-password-reset",
    RESET_PASSWORD: (token: string) => `/api/user/reset-password/${token}`,
    CHANGE_PASSWORD: "/api/user/change-password",
  },
  BUSINESS: {
    REGISTER: "/api/business/register",
    LOGIN: "/api/business/login",
    GET_ALL: "/api/business/admin/all",
    UPLOAD_DOC: "/api/business/upload-document",
    APPROVE: (id: string) => `/api/business/admin/approve/${id}`,
    GET_PROFILE: "/api/business/profile",
    UPDATE_PROFILE: "/api/business/profile/edit",
  },
  CATEGORY: {
    GET_ALL: "/api/categories",
    GET_BY_ID: (id: string) => `/api/categories/${id}`,
  },
  PRODUCT: {
    ADD: "/api/product",
    GET_BUSINESS: "/api/product/business",
    GET_BY_ID: (id: string) => `/api/product/${id}`,
    UPDATE: (id: string) => `/api/product/${id}`,
    DELETE: (id: string) => `/api/product/${id}`,
    GET_BY_CATEGORY: (categoryId: string) =>
      `/api/product/category/${categoryId}`,
  },
  CART: {
    GET: "/api/cart",
    ADD: "/api/cart/add",
    UPDATE: (productId: string) => `/api/cart/item/${productId}`,
    REMOVE: (productId: string) => `/api/cart/item/${productId}`,
    CLEAR: "/api/cart/clear",
    COUNT: "/api/cart/count",
  },
};
