import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Dropdown } from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = AntLayout

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: <Link to="/dashboard">Dashboard</Link>,
  },
  {
    key: '/products',
    icon: <ShoppingOutlined />,
    label: <Link to="/products">Products</Link>,
  },
  {
    key: '/orders',
    icon: <ShoppingCartOutlined />,
    label: <Link to="/orders">Orders</Link>,
  },
  {
    key: '/customers',
    icon: <UserOutlined />,
    label: <Link to="/customers">Customers</Link>,
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: <Link to="/settings">Settings</Link>,
  },
]

export default function Layout() {
  const location = useLocation()

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider width={240} theme="light">
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h2 style={{ margin: 0, color: '#2A4B7C' }}>Whitelabel Admin</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/dashboard']}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <AntLayout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: 8 }}>Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: '24px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}
