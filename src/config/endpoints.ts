export const API_ENDPOINTS = {
    departments: {
      list: '/api/departments/',
      create: '/api/departments/create/',  
      update: (id: number ) => `/api/departments/${id}/`,
      delete: (id: number) => `/api/departments/${id}/`,
      getById: (id: number) => `/api/departments/${id}/`,
    },
    organizations: {
      list: '/api/organizations/',
      create: '/api/organizations/create/',
      update: (id: number) => `/api/organizations/${id}/update/`,
      delete: (id: number) => `/api/organizations/${id}/delete/`,
      getById: (id: number) => `/api/organizations/${id}/`,
    },
    auth: {
      login: '/login/',
      logout: '/logout/',
      createAdmin: '/superadmin/create-admin/',
    },
    users: {
      list: '/api/users/',
      create: '/api/createuser/',
      update: (id: number) => `/api/users/${id}/`,
      delete: (id: number) => `/api/users/${id}/`,
      getById: (id: number) => `/api/users/${id}/`,
      adminCreate: '/api/admins/create/',
    },
    shifts: {
      list: '/api/shifts/',
      create: '/api/shifts/create/',
      update: (id: number) => `/api/shifts/${id}/`,
      delete: (id: number) => `/api/shifts/${id}/`,
      getById: (id: number) => `/api/shifts/${id}/`,
      assign: (id: number) => `/api/shifts/${id}/assign/`
    },
    holidays: {
      list: 'public/holidays/',
      create: '/api/holidays/create/',
      update: (id: number) => `/public/holidays/${id}/update/`,
      delete: (id: number) => `/public/holidays/${id}/delete/`,
      getById: (id: number) => `/public/holidays/${id}/`,
    },
    
    devices: {
      faceMatch: '/api/face-match/',
      esp32Pairing: '/api/esp32/pairing/',
      addCamera: '/api/add-camera/',
      locks: '/api/locks/',
      cameras: '/api/cameras/',
    },
    
    guestPasses: {
      list: '/api/guest-passes/all/',
      create: '/api/guest-passes/create/',
      approve: (guestPassId: number) => `/api/guest-passes/approve/${guestPassId}/`,
      getById: (guestPassId: number) => `/api/guest-passes/view/${guestPassId}/`,
    }
  };