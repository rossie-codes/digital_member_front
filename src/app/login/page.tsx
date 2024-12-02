// src/app/login/page.tsx
"use client";

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Checkbox, Typography, Anchor } from 'antd';
import styled from 'styled-components';
import Image from 'next/image';
// import { AuthContext } from '../context/AuthContext';
// const { Title } = Typography;


const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #ffffff;
`;

const StyledForm = styled(Form)`
  width: 100%;
  max-width: 400px;
`;

const StyledButton = styled(Button)`
  &.login_button {  // Target the className
    background-color: #0044cc; // Example: Blue background
    border-color: #0044cc;    // Example: Blue border
    color: #fff;             // Example: White text
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-weight: bold;
    

    &:hover {
      background-color: #003bb5; // Darker blue on hover
      border-color: #003bb5;
    }
  }
`;


const StyledAnchor = styled(Anchor)`
  &:hover {
    border-color: #f5222d; // Red border on hover
    box-shadow: 0 0 5px rgba(245, 34, 45, 0.5); // Subtle red shadow on hover
  }

  &:focus {
    border-color: #f5222d; // Red border on focus
    box-shadow: 0 0 5px rgba(245, 34, 45, 0.5); // Subtle red shadow on focus
    outline: none; // Remove default browser outline
  }
`;

const StyledInput = styled(Input)`
  &,
  &.ant-input-password {
    border: 1px solid #000000;
    height: 50px;

    &:hover {
      border-color: #999999;
      box-shadow: 0 0 5px rgba(245, 34, 45, 0.5);
    }

    &:focus {
      border-color: #999999;
      box-shadow: 0 0 5px rgba(245, 34, 45, 0.5);
      outline: none;
    }

    input {
      height: 48px;
    }

    &::placeholder {
      color: #999999;
      font-size: 16px;
    }
  }
`;


const Copyright = styled.div`
  position: absolute;
  bottom: 20px;
  text-align: center;
  width: 100%;
`;




const LoginPage = () => {
  const router = useRouter();
  // const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          admin_phone: values.admin_phone,
          password: values.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // No need to store the token manually
      // The cookie is handled by the browser

      console.log('going to dashboard')

      // Redirect to the dashboard
      console.log('before router.push');
      router.push('/dashboard');
      console.log('after router.push');
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed due to an unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Image src="/WATI_logo_full.png" alt="logo" width={200} height={100} style={{ marginBottom: 20 }} />
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#131313', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <a href="/login" style={{ color: '#D74D03', fontWeight: 'bold', textDecoration: 'none' }}>登入</a>
        <a href="/signup" style={{ color: '#FFFFFF', textDecoration: 'none' }}>Sign Up</a>
      </div>
      <StyledAnchor
        direction="horizontal"
        items={[
          {
            key: 'Login',
            href: '/login',
            title: 'Login',
          },
          {
            key: 'Sign_Up',
            href: '/signup',
            title: 'Sign Up',
          }
        ]}
      />

      <StyledForm
        name="login"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

        <Form.Item
          name="admin_phone"
          rules={[{ required: true, message: '請輸入您的帳戶!' }]}
          style={{ marginBottom: '16px' }}
        >
          <StyledInput placeholder="輸入帳戶" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '請輸入您的密碼!' }]}
          style={{ marginBottom: '16px' }}
        >
          <StyledInput placeholder="輸入密碼" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox>記住我</Checkbox>
            <a href='/forgotpassword'>忘記密碼</a>
          </div>
        </Form.Item>

        <Form.Item>
          {/* <Button type="primary" htmlType="submit" loading={loading} block style={{ background: '#4169E1', borderColor: '#4169E1' }}> */}
          <StyledButton className="login_button" type="primary" htmlType="submit" loading={loading}>
            登入
          </StyledButton>
        </Form.Item>

      </StyledForm>

      <Copyright>
        Copyright ©2024 Produced by AKA Studio
      </Copyright>
    </StyledContainer>
  );
};

export default LoginPage;