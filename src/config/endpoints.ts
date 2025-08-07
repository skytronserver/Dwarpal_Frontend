export const API_ENDPOINTS = {
   serviceProviders: {
    createFirm:'/api/service-providers/firm/',
    createIndividual:'/api/service-providers/individual/',
   },
   clients: {
    createCompany: '/api/clients/company/create/',
    // createIndividual: '/api/clients/individual/create/',
   },
   accountUser: {
    create: '/outer-accountuser/create/',
   },
   subscription: {
    create: '/api/subscriptions/create/',
   },
   hr: {
    create:'/create-hr/'
   },
   accounts: {
    create:'/create-accounts/'
   },
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
      login: '/user/login/',
      logout: '/logout/',
      otpVerification: '/user/verify-otp/',
      resendOtp: '/user/resend-otp/',
      createAdmin: '/superadmin/create-admin/',
    },
    users: {
      list: '/api/users/',
      createEmployee: '/hr/create-employee/',
      update: (id: number) => `/api/users/${id}/`,
      delete: (id: number) => `/api/users/${id}/`,
      getById: (id: number) => `/api/users/${id}/`,
      adminCreate: '/api/admins/create/',
      attendanceReport: `/api/user-attendance-report/`,
      activateUser: (token: string) => `/activate-user/${token}/`,
      },
    shifts: {
      list: '/api/shifts/',
      create: '/shift/create/',
      update: (id: number) => `/api/shifts/${id}/`,
      delete: (id: number) => `/api/shifts/${id}/`,
      getById: (id: number) => `/api/shifts/${id}/`,
      assign: (id: number) => `/api/shifts/${id}/assign/`,
      approve: (id: number) => `/shift/approve/${id}/`
    },
    holidays: {
      list: 'public/holidays/',
      create: '/api/holidays/create/',
      approve: (id: number) => `/holidays/${id}/approve/`,
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
    },

    dashboard: {
      superAdmin: '/api/dashboard/superadmin/',
      admin: '/api/dashboard/admin/',
      hr: '/api/dashboard/hr/',
      employee: '/api/dashboard/employee/',
    }
  }; 