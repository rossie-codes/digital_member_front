// src/app/dashboard/broadcast_setting/page.tsx

import React, { Suspense } from 'react';
import BroadcastSettingPage from './BroadcastSettingPage';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BroadcastSettingPage />
    </Suspense>
  );
};

export default Page;