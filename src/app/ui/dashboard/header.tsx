"use client"

import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import NavLinks from '@/app/ui/dashboard/nav-links';

const { Header, Content, Footer } = Layout;

const items = new Array(1).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const DashboardHeader: React.FC = function DashboardHeader() {

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
          <NavLinks />
      </Header>
    </Layout>
  );
};

export default DashboardHeader;