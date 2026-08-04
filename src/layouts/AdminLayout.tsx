import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Drawer from '../components/Drawer';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onCollapseChange={setCollapsed} />

      <Drawer open={drawerOpen} title="Khanna Polyrib" onClose={() => setDrawerOpen(false)}>
        <Sidebar
          collapsed={false}
          onCollapseChange={setCollapsed}
          mobile
          onNavigate={() => setDrawerOpen(false)}
        />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setDrawerOpen(true)} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
