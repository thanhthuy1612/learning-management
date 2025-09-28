// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      account: `${ROOTS.DASHBOARD}/user/account`,
    },
    exam: {
      root: `${ROOTS.DASHBOARD}/exam`,
      new: `${ROOTS.DASHBOARD}/exam/new`,
      list: `${ROOTS.DASHBOARD}/exam/list`,
    },
    examSession: {
      root: `${ROOTS.DASHBOARD}/exam-session`,
      new: `${ROOTS.DASHBOARD}/exam-session/new`,
      list: `${ROOTS.DASHBOARD}/exam-session/list`,
    },
    scores: {
      root: `${ROOTS.DASHBOARD}/scores`,
      list: `${ROOTS.DASHBOARD}/scores/list`,
    },
  },
  pin: '/exam',
  exam: (id: string) => `/exam/${id}`,
};
