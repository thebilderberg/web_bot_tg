import React, { useMemo, useState } from "react";
import { Alert, Button, Form, Input, Modal, Tabs } from "antd";
import { HttpError, NetworkError } from "./api";
import { useAuth } from "./AuthProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

function errorToMessage(code?: string) {
  switch (code) {
    case "INVALID_INPUT":
      return "Проверьте логин и пароль. Логин: 3–32 символа (латиница/цифры/_). Пароль: минимум 8 символов.";
    case "LOGIN_TAKEN":
      return "Этот логин уже занят.";
    case "INVALID_CREDENTIALS":
      return "Неверный логин или пароль.";
    case "SERVER_ERROR":
      return "Ошибка сервера. Попробуйте позже.";
    case "API_UNREACHABLE":
      return "Backend API недоступен (скорее всего не запущен Postgres/сервер). Поднимите БД и backend, затем повторите.";
    default:
      return "Не удалось выполнить действие. Попробуйте ещё раз.";
  }
}

export function AuthModal({ open, onClose }: Props) {
  const { login, register } = useAuth();
  const [activeKey, setActiveKey] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form] = Form.useForm();

  const title = useMemo(
    () => (activeKey === "login" ? "Вход" : "Регистрация"),
    [activeKey]
  );

  const handleFinish = async (values: { login: string; password: string }) => {
    setSubmitting(true);
    setError(null);
    try {
      if (activeKey === "login") {
        await login(values.login, values.password);
      } else {
        await register(values.login, values.password);
      }
      form.resetFields();
      onClose();
    } catch (e) {
      if (e instanceof HttpError) setError(errorToMessage(e.code));
      else if (e instanceof NetworkError) setError(errorToMessage(e.message));
      else setError("Неизвестная ошибка.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={title}
      destroyOnClose
    >
      <Tabs
        activeKey={activeKey}
        onChange={(k) => {
          setActiveKey(k as any);
          setError(null);
          form.resetFields();
        }}
        items={[
          { key: "login", label: "Вход" },
          { key: "register", label: "Регистрация" }
        ]}
      />

      {error && (
        <Alert
          style={{ marginBottom: 12 }}
          type="error"
          showIcon
          message={error}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Логин"
          name="login"
          rules={[
            { required: true, message: "Введите логин" },
            { min: 3, max: 32, message: "3–32 символа" },
            { pattern: /^[a-zA-Z0-9_]+$/, message: "Только латиница, цифры и _" }
          ]}
        >
          <Input autoComplete="username" placeholder="user7" />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Введите пароль" },
            { min: 8, max: 128, message: "Минимум 8 символов" }
          ]}
        >
          <Input.Password autoComplete={activeKey === "login" ? "current-password" : "new-password"} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={submitting}>
          {activeKey === "login" ? "Войти" : "Создать аккаунт"}
        </Button>
      </Form>
    </Modal>
  );
}

