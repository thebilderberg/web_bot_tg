import React, { useMemo, useState } from "react";
import {
  MenuOutlined,
  UserOutlined,
  HomeOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu, Popover } from "antd";
import "./BurgerMenu.css";
import { useNavigation } from "../../navigation/NavigationProvider";

type MenuItem = Required<MenuProps>["items"][number];

function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const { route, navigate } = useNavigation();

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { key: "home", icon: <HomeOutlined />, label: "Главная" },
      { key: "account", icon: <UserOutlined />, label: "Аккаунт" }
    ],
    []
  );

  return (
    <div className="Burger">
      <Popover
        trigger="click"
        placement="bottomLeft"
        open={open}
        onOpenChange={setOpen}
        overlayClassName="BurgerPopover"
        destroyTooltipOnHide
        content={
          <div className="BurgerMenuPanel" role="menu">
            <Menu
              selectedKeys={[route]}
              mode="inline"
              theme="dark"
              items={menuItems}
              className="BurgerMenu"
              onClick={(info) => {
                navigate(info.key as any);
                setOpen(false);
              }}
            />
          </div>
        }
      >
        <Button
          aria-label="Открыть меню"
          type="primary"
          className="BurgerButton"
          icon={<MenuOutlined />}
          size="large"
        />
      </Popover>
    </div>
  );
}

export default BurgerMenu;
