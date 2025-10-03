// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
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
      root: `${ROOTS.DASHBOARD}/session`,
      new: `${ROOTS.DASHBOARD}/session/new`,
      list: `${ROOTS.DASHBOARD}/session/list`,
    },
    scores: {
      root: `${ROOTS.DASHBOARD}/scores`,
      list: `${ROOTS.DASHBOARD}/scores/list`,
    },
  },
  pin: '/exam',
  exam: '/exam/quiz',
  error: {
    403: 'error/403',
    404: 'error/404',
    500: 'error/500',
  },
};
