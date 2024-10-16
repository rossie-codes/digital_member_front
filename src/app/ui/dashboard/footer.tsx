"use client"

import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Footer } = Layout;

const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const App: React.FC = () => {

  return (
    <Layout>
      <Footer style={{ textAlign: 'center' }}>
        DIGITAL MEMBER ©{new Date().getFullYear()} Created by WATI
      </Footer>
    </Layout>
  );
};

export default App;