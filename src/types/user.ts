// ----------------------------------------------------------------------

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type IUserItem = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  phoneNumber: string;
};
