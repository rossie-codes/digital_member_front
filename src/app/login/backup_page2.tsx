// 完成基本 login page

// 想加入 login function 


// // src/app/login/page.tsx
// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button, Form, Input, Checkbox, Typography, Anchor } from 'antd';
// import styled from 'styled-components';
// import Image from 'next/image';

// const { Title } = Typography;


// const StyledContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   min-height: 100vh;
//   padding: 20px;
// `;

// const StyledForm = styled(Form)`
//   width: 100%;
//   max-width: 400px;
// `;

// const StyledButton = styled(Button)`
//   &.login_button {  // Target the className
//     background-color: #10239e; // Example: Blue background
//     border-color: #10239e;    // Example: Blue border
//     color: #fff;             // Example: White text
//     width: 40%;
    

//     &:hover {
//       background-color: #0069d9; // Darker blue on hover
//       border-color: #0062cc;
//     }
//   }
// `;

// // const abc = {
// //   theme: {
// //     components: {
// //       Button: {
// //         colorPrimary: '#ffa39e',
// //         borderRadius: 10,
// //         controlHeight: 50,
// //         // solidTextColor: '#ffa39e'
// //         contentFontSize: 16,
// //         colorPrimaryHover: '#ffa20e'
// //       }
// //     },
// //   }
// // }



// const StyledAnchor = styled(Anchor)`
//   &:hover {
//     border-color: #f5222d; // Red border on hover
//     box-shadow: 0 0 5px rgba(245, 34, 45, 0.5); // Subtle red shadow on hover
//   }

//   &:focus {
//     border-color: #f5222d; // Red border on focus
//     box-shadow: 0 0 5px rgba(245, 34, 45, 0.5); // Subtle red shadow on focus
//     outline: none; // Remove default browser outline
//   }
// `;



// // const StyledInput = styled(Input)`
// //   border: 1px solid #000000;
// //   height: 50px;
// //   activeBorderColor: #f5222d;
// //   activeShadow: #f5222d;
// //   hoverBorderColor
// //   &::placeholder {
// //     color: #999999; /* Example: Light gray placeholder color */
// //     font-style: ;  /* Example: Italic font style */
// //     font-size: 16px;   /* Example: 16px font size */
// //   }
// // `;


// const StyledInput = styled(Input)`
//   border: 1px solid #000000;
//   height: 50px;

//   &:hover {
//     border-color: #f5222d; // Red border on hover
//     box-shadow: 0 0 5px rgba(245, 34, 45, 0.5); // Subtle red shadow on hover
//   }

//   &:focus {
//     border-color: #f5222d; // Red border on focus
//     box-shadow: 0 0 5px rgba(245, 34, 45, 0.5); // Subtle red shadow on focus
//     outline: none; // Remove default browser outline
//   }

//   &::placeholder {
//     color: #999999;
//     font-size: 16px;
//   }
// `;


// // const StyledTabs = styled(Tabs)`
// //   width: 100%;
// //   max-width: 400px;


// //   .ant-tabs-nav::before {
// //     border-bottom: none;

// //   }
// //   .ant-tabs-tab {
// //     color: #ffffff;
// //     background: #000000;
// //   }
// //   .ant-tabs-tab-active {
// //     color: #ff6600;
// //     background: #000000;
// //   }
// //   .ant-tabs-nav-list {
// //     width: 100%;
// //     background: #000000;
// //   }
// //   .ant-tabs-tab {
// //     width: 100%;
// //     justify-content: center;
// //   }
// // `;

// const Copyright = styled.div`
//   position: absolute;
//   bottom: 20px;
//   text-align: center;
//   width: 100%;
// `;

// const LoginPage = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const onFinish = async (values: any) => {
//     // Your login logic here
//   };

//   return (
//     <StyledContainer>
//       <Image src="/WATI_logo_full.png" alt="logo" width={200} height={100} style={{ marginBottom: 20 }} />

//       <StyledAnchor
//         direction="horizontal"
//         items={[
//           {
//             key: 'Login',
//             href: '#Login',
//             title: 'Login',
//           },
//           {
//             key: 'Sign_Up',
//             href: '#Sign_Up',
//             title: 'Sign Up',
//           }
//         ]}
//       />

//       {/* <StyledTabs defaultActiveKey="1" centered>
//         <Tabs.TabPane tab="Login" key="1" />
//         <Tabs.TabPane tab="Sign Up" key="2" />
//       </StyledTabs> */}

//       <StyledForm
//         name="login"
//         initialValues={{ remember: true }}
//         onFinish={onFinish}
//         autoComplete="off"
//       >
//         {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}


//         <Form.Item
//           name="member_phone"
//           rules={[{ required: true, message: 'Please input your phone number!' }]} // Updated message
//           style={{ marginBottom: '16px' }} // Add margin between form items
//         >
//           <StyledInput placeholder="請輸入您的手機號碼" /> {/* Updated placeholder, using styled component */}
//         </Form.Item>



//         <Form.Item
//           name="password"
//           rules={[{ required: true, message: 'Please input your password!' }]} // Updated message
//           style={{ marginBottom: '16px' }} // Add margin between form items
//         >
//           <StyledInput placeholder="輸入密碼" /> {/* Updated placeholder, using styled component */}
//         </Form.Item>


//         {/* <Form.Item
//           name="password"
//           rules={[{ required: true, message: 'Please input your password!' }]}
//         >
//           <Input.Password placeholder="輸入密碼" />
//         </Form.Item> */}

//         <Form.Item>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Checkbox>記住我</Checkbox>
//             <a href='/forgotpassword'>忘記密碼</a>
//           </div>
//         </Form.Item>

//         {/* <ConfigProvider {...abc} > */}
//           <Form.Item>
//             {/* <Button type="primary" htmlType="submit" loading={loading} block style={{ background: '#4169E1', borderColor: '#4169E1' }}> */}
//             <StyledButton className="login_button" type="primary" htmlType="submit" loading={loading}>
//               登入
//             </StyledButton>
//           </Form.Item>
//         {/* </ConfigProvider> */}

//       </StyledForm>

//       <Copyright>
//         Copyright ©2024 Produced by AKA Studio
//       </Copyright>
//     </StyledContainer>
//   );
// };

// export default LoginPage;