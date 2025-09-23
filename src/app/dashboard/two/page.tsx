'use client';

import React from 'react';

import { useAppSelector } from 'src/lib/hooks';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

export default function Page() {
  // const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.user);
  // React.useEffect(() => {
  //   dispatch(updateEmail('1'));
  // }, []);
  console.log(email);
  return <BlankView title="Page two" />;
}
