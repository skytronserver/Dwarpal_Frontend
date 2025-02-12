export const API_ENDPOINTS = {
    departments: {
      list: '/api/departments/',
      create: '/api/departments/create/',  
      update: (id: string | number) => `/department/edit/${id}/`,
      delete: (id: string | number) => `/api/department/${id}/`
    },
    organizations: {
      list: '/api/organizations/',
      create: '/api/organizations/create/',
      update: (id: string) => `/organization/edit/${id}/`,
      delete: (id: number) => `/organization/delete/${id}/`,
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
  };