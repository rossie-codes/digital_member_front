// src/app/login/page.tsx
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Checkbox, Typography, Anchor, FormProps } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import Image from "next/image";

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
  gap: 22px;

  /* 背景圖片 */
  background-image: url("/website-Login.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;


const StyledSpan = styled.span`
  color: var(--key-colors-tertiary, #d74d03);
  font-family: "Noto Sans HK";
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 36px;
  position: relative;
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 60px;
    background-color: #ffe0d0;
    border-radius: 50%;
    z-index: -1;
  }
`;

const StyledInput = styled(Input)`
  &,
  &.ant-input-password {
    display: flex;
    height: 44px;
    padding: 12px;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
    border-radius: 5px;
    border: 1px solid var(--key-colors-primary, #131313);
    background: var(--White, #fff);

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
      color: var(--DarkGray, #737277);

      /* body */
      font-family: "Noto Sans HK";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.32px;
    }
  }
`;
const StyledPasswordInput = styled(Input.Password)`
  &.ant-input-password {
    display: flex;
    height: 44px;
    padding: 12px;
    align-items: center;
    border-radius: 5px;
    border: 1px solid var(--key-colors-primary, #131313);
    background: var(--White, #fff);

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
      height: 100%;
      border: none;
      box-shadow: none;
      font-size: 16px;
    }

    input::placeholder {
      color: var(--DarkGray, #737277);
      font-family: "Noto Sans HK";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 137.5% */
      letter-spacing: -0.32px;
    }
  }

  /* 調整密碼切換按鈕的樣式 */
  .ant-input-suffix {
    display: flex;
    align-items: center;
    padding-right: 8px; /* 與 Input.Padding 一致 */
    svg {
      font-size: 18px;
      color: #737277;
      cursor: pointer;

      &:hover {
        color: #0044cc;
      }
    }
  }
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const StyledCheckbox = styled(Checkbox)`
  color: var(--character-title-85, rgba(0, 0, 0, 0.85));

  /* body */
  font-family: "Noto Sans HK";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 137.5% */
  letter-spacing: -0.32px;

  .ant-checkbox-inner {
    border: 1px solid currentColor !important;
    border-radius: 3px;
  }

  &:hover .ant-checkbox-inner {
    border-color: #d74d03 !important;
  }

  &:hover {
    color: var(--character-title-85, rgba(0, 0, 0, 0.85)) !important;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #d74d03 !important;
    border-color: #d74d03 !important;
  }

  .ant-checkbox-inner::after {
    border-color: #ffffff !important;
  }

  .ant-checkbox-disabled .ant-checkbox-inner {
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
  }

  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #d74d03 !important;
    box-shadow: none !important;
  }
`;

const StyledLink = styled.a`
  color: var(--key-colors-tertiary, #d74d03) !important;

  /* body */
  font-family: "Noto Sans HK";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 137.5% */
  letter-spacing: -0.32px;

  &:hover {
    text-decoration: underline;
    color: #d74d03 !important;
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
    color: #d74d03 !important;
  }
`;

const StyledButton = styled(Button)`
  &.login_button {
    display: flex;
    width: 99px;
    height: 32px;
    padding: 8px 10px;
    justify-content: center;
    align-items: center;
    gap: 3px;
    border-radius: 5px;
    background: var(--key-colors-secondary, #0b49a0);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .anticon {
    font-size: 24px;
    vertical-align: middle;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButtonText = styled.span`
  color: var(--White, #fff);

  /* body small heavy */
  font-family: "Noto Sans HK";
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 19px; /* 135.714% */
  letter-spacing: -0.28px;
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

const Copyright = styled.div`
  color: var(--character-secondary-45, rgba(0, 0, 0, 0.45));

  /* body small */
  font-family: "Noto Sans HK";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  letter-spacing: -0.28px;
`;

const ABC = styled.div`
width: 100%;
max-width: 400px;
`;


type FieldType = {
  memberPhone?: number;
  memberPassword?: string;
};



const LoginPage: React.FC = () => {
  const router = useRouter();
  // const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const [passwordVisible, setPasswordVisible] = useState(false); // 控制密碼顯示狀態

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev); // 切換密碼顯示狀態
  };

  // const onFinish = async (values: any) => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_auth/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include', // Include cookies in the request
  //       body: JSON.stringify({
  //         admin_name: values.admin_name,
  //         admin_password: values.admin_password,
  //       }),
  //     });

  //     console.log('response:', response.ok);
  //     if (response.ok) {
  //       router.push('/dashboard');
  //     } else {
  //       // Handle login error
  //       const errorData = await response.json();
  //       console.error("Login error:", errorData.error);
  //       // Display error message to the user as needed
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     setError("Login failed due to an unexpected error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };




  const handleSubmit: FormProps<FieldType>['onFinish'] = async (values: any) => {
    setLoading(true);
    setError("");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({
        admin_name: values.admin_name,
        admin_password: values.admin_password,
      }),
    });
    if (response.ok) {
      router.push('/dashboard');
    } else {
      const errorData = await response.json();
      console.error('Login error:', errorData.error);
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Image
        src="/membi-logo-standard 1.png"
        alt="logo"
        width={200}
        height={100}
        style={{ marginBottom: 22 }}
      />
      <StyledSpan>登入</StyledSpan>

      <ABC>
        <Form
          name="login"
          form={form}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}

          <Form.Item
            name="admin_name"
            rules={[{ required: true, message: "請輸入您的帳戶!" }]}
            style={{ marginBottom: "28px" }}
          >
            <StyledInput placeholder="輸入帳戶" />
          </Form.Item>

          <Form.Item
            name="admin_password"
            rules={[{ required: true, message: "請輸入您的密碼!" }]}
            style={{ marginBottom: "16px" }}
          >
            <StyledPasswordInput placeholder="輸入密碼" />
          </Form.Item>

          <Form.Item>
            <FormOptions>
              <StyledCheckbox>記住我</StyledCheckbox>
              <StyledLink href="/forgotpassword">忘記密碼</StyledLink>
            </FormOptions>
          </Form.Item>

          <Form.Item>
            <ButtonWrapper>
              <StyledButton
                className="login_button"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                <StyledButtonText>登入</StyledButtonText>
                <LoginOutlined />
              </StyledButton>
            </ButtonWrapper>
          </Form.Item>

        </Form>
      </ABC>

      <Copyright>Copyright ©2024 Produced by AKA Studio</Copyright>
    </StyledContainer>
  );
};

export default LoginPage;
