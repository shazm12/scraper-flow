import { SetupUser } from '@/actions/billing/setupUser';
import React from 'react';

async function SetupPage() {
  return await SetupUser();
}

export default SetupPage;
