// "use client"

// import React from 'react';
// import { Breadcrumb, Layout, Menu, theme } from 'antd';
// import NavLinks from '@/app/ui/dashboard/nav-links';

// const { Header, Content, Footer } = Layout;

// const items = new Array(1).fill(null).map((_, index) => ({
//   key: index + 1,
//   label: `nav ${index + 1}`,
// }));

// const App: React.FC = () => {
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   return (
//     <Layout>
//       <Header style={{ display: 'flex', alignItems: 'center' }}>
//         <div className="demo-logo" />
//         <Menu
//           theme="dark"
//           mode="horizontal"
//           defaultSelectedKeys={['2']}
//           items={items}
//           style={{ flex: 1, minWidth: 0 }}
//         />
//         {/* <NavLinks
//           theme="dark"
//           mode="horizontal"
//           defaultSelectedKeys={['2']}
//           items={items}
//           style={{ flex: 2, minWidth: 0 }} /> */}
//       </Header>
//     </Layout>
//   );
// };

// export default App;