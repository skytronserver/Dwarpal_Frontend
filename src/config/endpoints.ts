export const API_ENDPOINTS = {
    departments: {
      list: '/api/departments/',
      create: '/api/departments/create/',  
      update: (id: string | number) => `/department/edit/${id}/`,
      delete: (id: string | number) => `/department/delete/${id}/`,
      getById: (id: string | number) => `/department/edit/${id}/`,
    },
    organizations: {
      list: '/api/organizations/',
      create: '/api/organizations/create/',
      update: (id: string) => `/organization/edit/${id}/`,
      delete: (id: number) => `/organization/delete/${id}/`,
      getById: (id: string) => `/organization/edit/${id}/`,
    },
    auth: {
      login: '/login/',
    },
    users: {
      list: '/api/users/',
      create: '/api/users/create/',
      update: (id: string) => `/api/users/${id}/update/`,
      delete: (id: string) => `/api/users/${id}/delete/`,
      getById: (id: string) => `/api/users/${id}/`,
    },
    shifts: {
      list: '/api/shifts/',
      create: '/api/shifts/create/',
      assign: (id: string) => `/api/shifts/assignments/create/${id}/`,
      update: (id: string) => `/api/shifts/${id}/update/`,
      delete: (id: string) => `/api/shifts/${id}/delete/`,
      getById: (id: string) => `/api/shifts/${id}/`,
    },
    holidays: {
      list: '/api/holidays/',
      create: '/api/holidays/create/',
      update: (id: string) => `/api/holidays/${id}/update/`,
      delete: (id: string) => `/api/holidays/${id}/delete/`,
      getById: (id: string) => `/api/holidays/${id}/`,
    },
  };