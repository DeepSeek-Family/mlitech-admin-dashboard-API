import { Menu, Modal } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import {
  Dashboard,
  Marchant,
  Settings,
  SubscriptionManagement,
  People,
  PromotionManagement,
  SalesRep,
  AuditLog,
  loginCredentials,
  Rewords,
} from "../../components/common/Svg";
import image4 from "../../assets/image4.png";
import { useUser } from "../../provider/User";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const showLogoutConfirm = () => setIsLogoutModalOpen(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false);
    navigate("/auth/login");
  };
  const handleCancel = () => setIsLogoutModalOpen(false);

  const isItemActive = (itemKey) =>
    selectedKey === itemKey ||
    (itemKey === "subMenuSetting" &&
      ["/profile", "/terms-and-conditions", "/privacy-policy"].includes(
        selectedKey,
      ));

  const renderIcon = (IconComponent, itemKey) => {
    const isActive = isItemActive(itemKey);
    return (
      <div
        style={{ width: 20, height: 20 }}
        className={isActive ? "svg-active" : ""}
      >
        <IconComponent
          className="menu-icon"
          fill={isActive ? "#ffffff" : "#1E1E1E"}
        />
      </div>
    );
  };

  // Settings submenu
  const settingsMenu = {
    key: "subMenuSetting",
    icon: renderIcon(Settings, "subMenuSetting"),
    label: collapsed ? "" : "Settings",
    children: [
      {
        key: "/profile",
        label: <Link to="/profile">{collapsed ? "" : "Update Profile"}</Link>,
      },
      {
        key: "/user-management",
        label: (
          <Link to="/user-management">
            {collapsed ? "" : "User Management"}
          </Link>
        ),
      },
      {
        key: "/terms-and-conditions",
        label: (
          <Link to="/terms-and-conditions">
            {collapsed ? "" : "Terms And Conditions"}
          </Link>
        ),
      },
      {
        key: "/privacy-policy",
        label: (
          <Link to="/privacy-policy">{collapsed ? "" : "Privacy Policy"}</Link>
        ),
      },
    ],
  };

  // Sales Rep Portal
  const salesRepMenu = {
    key: "/sales-rep-portal",
    icon: renderIcon(SalesRep, "/sales-rep-portal"),
    label: (
      <Link to="/sales-rep-portal">{collapsed ? "" : "Sales Rep Portal"}</Link>
    ),
  };

  // Get base menu items for all roles
  const getMenuItems = () => {
    const isAdminRep = user?.role === "ADMIN_REP";

    if (isAdminRep) {
      // Show only Sales Rep Portal, Settings, and Logout for ADMIN_REP
      return [
        salesRepMenu,
        settingsMenu,
        {
          key: "/logout",
          icon: <IoIosLogOut size={24} />,
          label: <p onClick={showLogoutConfirm}>{collapsed ? "" : "Logout"}</p>,
        },
      ];
    }

    // Show all menu items for other roles with logout button
    return [
      {
        key: "/",
        icon: renderIcon(Dashboard, "/"),
        label: <Link to="/">{collapsed ? "" : "Dashboard Overview"}</Link>,
      },
      {
        key: "/merchant-management",
        icon: renderIcon(Marchant, "/merchant-management"),
        label: (
          <Link to="/merchant-management">
            {collapsed ? "" : "Merchant Management"}
          </Link>
        ),
      },
      {
        key: "/customer-management",
        icon: renderIcon(People, "/customer-management"),
        label: (
          <Link to="/customer-management">
            {collapsed ? "" : "Customer Profile"}
          </Link>
        ),
      },
      {
        key: "/tier-system",
        icon: renderIcon(People, "/tier-system"),
        label: (
          <Link to="/tier-system">
            {collapsed ? "" : "Point & Tier System"}
          </Link>
        ),
      },
      {
        key: "/reporting-analytics",
        icon: renderIcon(Rewords, "/reporting-analytics"),
        label: (
          <Link to="/reporting-analytics">
            {collapsed ? "" : "Reporting & Analytics"}
          </Link>
        ),
      },
      {
        key: "/membership-plans",
        icon: renderIcon(SubscriptionManagement, "/membership-plans"),
        label: (
          <Link to="/membership-plans">
            {collapsed ? "" : "Membership Plans"}
          </Link>
        ),
      },
      {
        key: "/promotion-management",
        icon: renderIcon(PromotionManagement, "/promotion-management"),
        label: (
          <Link to="/promotion-management">
            {collapsed ? "" : "Promotion Management"}
          </Link>
        ),
      },
      salesRepMenu,
      {
        key: "/audit-logs",
        icon: renderIcon(AuditLog, "/audit-logs"),
        label: <Link to="/audit-logs">{collapsed ? "" : "Audit Logs"}</Link>,
      },
      {
        key: "/push-notification",
        icon: renderIcon(loginCredentials, "/push-notification"),
        label: (
          <Link to="/push-notification">
            {collapsed ? "" : "Push Notifications"}
          </Link>
        ),
      },
      settingsMenu,
      {
        key: "/logout",
        icon: <IoIosLogOut size={24} />,
        label: <p onClick={showLogoutConfirm}>{collapsed ? "" : "Logout"}</p>,
      },
    ];
  };

  const menuItems = getMenuItems();

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path ||
        (item.children && item.children.some((sub) => sub.key === path)),
    );
    if (selectedItem) {
      setSelectedKey(path);
      if (selectedItem.children) setOpenKeys([selectedItem.key]);
      else {
        const parentItem = menuItems.find(
          (item) =>
            item.children && item.children.some((sub) => sub.key === path),
        );
        if (parentItem) setOpenKeys([parentItem.key]);
      }
    }
  }, [path, menuItems]);

  const handleOpenChange = (keys) => setOpenKeys(keys);

  return (
    <div
      className="h-full flex flex-col bg-white border-r border-primary transition-all duration-300"
      style={{ width: collapsed ? 80 : 250 }}
    >
      {/* Toggle Button */}
      {/* <div
        className="flex justify-end items-center p-2 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <MenuUnfoldOutlined style={{ fontSize: 20 }} />
        ) : (
          <MenuFoldOutlined style={{ fontSize: 20 }} />
        )}
      </div> */}

      {/* Logo */}
      {!collapsed && (
        <Link
          to={"/"}
          className="logo-container flex items-center justify-center py-4"
        >
          <img src={image4} alt="logo" className="w-40 h-40" />
        </Link>
      )}

      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          className="font-poppins text-black border-none"
          items={menuItems.map((item) => ({
            ...item,
            children: item.children
              ? item.children.map((subItem) => ({ ...subItem }))
              : undefined,
          }))}
        />
      </div>

      {/* Logout Modal */}
      <Modal
        centered
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default Sidebar;
