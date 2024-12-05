"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Typography, Anchor } from 'antd';
import styled from 'styled-components';
import Image from 'next/image';

const { Title } = Typography;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const StyledForm = styled(Form)`
  width: 100%;
  max-width: 400px;
`;

const StyledButton = styled(Button)`
  &.login_button {  // Target the className
    background-color: #10239e; // Example: Blue background
    border-color: #10239e;    // Example: Blue border
    color: #fff;             // Example: White text
    width: 40%;
    

    &:hover {
      background-color: #0069d9; // Darker blue on hover
      border-color: #0062cc;
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


const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFinish = async (values: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_auth/signup`, {
        method: 'POST',
        body: JSON.stringify({
          admin_name: values.admin_name,
          admin_password: values.admin_password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }


      if (!res.ok) {
        if (res.status === 403) {
          setError('Admin account already exists. Please log in.');
          // Optionally redirect to login page
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          setError(data.error || 'Signup failed');
        }
        setLoading(false);
        return;
      }


      router.push('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed due to an unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      {/* Your styled form components */}
      <Image src="/WATI_logo_full.png" alt="logo" width={200} height={100} style={{ marginBottom: 20 }} />
      
      <Form onFinish={onFinish}>
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        <Form.Item
          name="admin_name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <StyledInput placeholder="Admin Name" />
        </Form.Item>
        <Form.Item
          label="Admin Password"
          name="admin_password"
          rules={[{ required: true, message: "Please enter a new password" }]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>
        <Form.Item
          label="Confirm Admin Password"
          name="confirm_admin_password"
          dependencies={["new_admin_password"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_admin_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match."));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
        <Form.Item>
          <StyledButton type="primary" htmlType="submit" loading={loading}>
            建立帳戶
          </StyledButton>
        </Form.Item>
      </Form>
    </StyledContainer>
  );
};

export default SignupPage;