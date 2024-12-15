"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Typography, Anchor } from "antd";
import styled from "styled-components";
import Image from "next/image";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LoginOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

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

const StyledForm = styled(Form)`
  width: 100%;
  max-width: 400px;
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

const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin_auth/signup`,
        {
          method: "POST",
          body: JSON.stringify({
            admin_name: values.admin_name,
            admin_password: values.admin_password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        if (res.status === 403) {
          setError("Admin account already exists. Please log in.");
          // Optionally redirect to login page
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          setError(data.error || "Signup failed");
        }
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed due to an unexpected error");
    } finally {
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
      <StyledSpan>註冊</StyledSpan>

      <StyledForm
        name="login"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
        <Form.Item
          name="admin_name"
          rules={[{ required: true, message: "請輸入一個新的名稱!" }]}
          style={{ marginBottom: "16px" }}
        >
          <StyledInput placeholder="輸入新名稱" />
        </Form.Item>
        <Form.Item
          name="admin_password"
          rules={[{ required: true, message: "請輸入一個新的密碼!" }]}
          style={{ marginBottom: "16px" }}
        >
          <StyledPasswordInput placeholder="輸入新密碼" />
        </Form.Item>
        <Form.Item
          name="confirm_admin_password"
          dependencies={["new_admin_password"]}
          style={{ marginBottom: "16px" }}
          rules={[
            { required: true, message: "請再次輸入密碼!" },
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
          <StyledPasswordInput placeholder="再次輸入新密碼" />
        </Form.Item>

        <Form.Item>
          <ButtonWrapper>
            <StyledButton
              className="login_button"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              <StyledButtonText>註冊</StyledButtonText>
              <LoginOutlined />
            </StyledButton>
          </ButtonWrapper>
        </Form.Item>
      </StyledForm>
    </StyledContainer>
  );
};

export default SignupPage;
