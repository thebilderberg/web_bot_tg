import React, { useState } from "react";
import { Button, Modal, Space, Typography, message } from "antd";
import { AuthModal } from "./AuthModal";
import { useAuth } from "./AuthProvider";

export function AuthStatus() {
  const { state, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [msgApi, msgCtx] = message.useMessage();

  if (state.status === "loading") {
    return (
      <Typography.Text style={{ opacity: 0.75, color: "rgba(255,255,255,0.85)" }}>
        Проверяем сессию…
      </Typography.Text>
    );
  }

  if (state.status === "anonymous") {
    return (
      <>
        <Button onClick={() => setOpen(true)}>Вход / Регистрация</Button>
        <AuthModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      {msgCtx}
      <Space size={12}>
      <Typography.Text style={{ color: "rgba(255,255,255,0.88)" }}>
        Вы вошли как <b>{state.user.login}</b>
      </Typography.Text>
      <Button
        onClick={() => setConfirming(true)}
      >
        Выйти
      </Button>
      </Space>

      <Modal
        open={confirming}
        title="Выйти из аккаунта?"
        okText="Выйти"
        cancelText="Отмена"
        onCancel={() => setConfirming(false)}
        onOk={async () => {
          await logout();
          msgApi.success("Вы вышли из аккаунта");
          setConfirming(false);
        }}
      >
        <Typography.Text>
          После выхода вы сможете войти под другим аккаунтом (мультиаккаунтность).
        </Typography.Text>
      </Modal>
    </>
  );
}

