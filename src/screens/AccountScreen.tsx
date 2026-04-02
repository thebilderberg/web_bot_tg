import React from "react";
import { Card, Typography } from "antd";
import { useAuth } from "../auth/AuthProvider";

export function AccountScreen() {
  const { state } = useAuth();

  return (
    <Card
      style={{
        background: "rgba(255,255,255,0.04)",
        borderColor: "rgba(255,255,255,0.08)"
      }}
      bodyStyle={{ color: "rgba(255,255,255,0.92)" }}
    >
      <Typography.Title level={3} style={{ marginTop: 0, color: "rgba(255,255,255,0.92)" }}>
        Аккаунт
      </Typography.Title>

      {state.status === "authenticated" ? (
        <Typography.Paragraph style={{ marginBottom: 0, color: "rgba(255,255,255,0.88)" }}>
          Вы вошли как <b>{state.user.login}</b>
          <br />
          ID: <code>{state.user.id}</code>
        </Typography.Paragraph>
      ) : state.status === "loading" ? (
        <Typography.Text style={{ color: "rgba(255,255,255,0.75)" }}>
          Загрузка…
        </Typography.Text>
      ) : (
        <Typography.Text style={{ color: "rgba(255,255,255,0.75)" }}>
          Вы не вошли. Нажмите “Вход / Регистрация” справа сверху.
        </Typography.Text>
      )}
    </Card>
  );
}

