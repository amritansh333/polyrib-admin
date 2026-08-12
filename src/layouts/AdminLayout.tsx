import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Drawer from '../components/Drawer';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar collapsed={collapsed} onCollapseChange={setCollapsed} />

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        title={
          <span className="font-heading text-lg font-bold tracking-tight text-primary">
            Khanna Polyrib Pvt. Ltd.
          </span>
        }
        onClose={() => setDrawerOpen(false)}
      >
        <Sidebar
          collapsed={false}
          onCollapseChange={setCollapsed}
          mobile
          onNavigate={() => setDrawerOpen(false)}
        />
      </Drawer>

      {/* Main Application Area */}
      <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
        {/* STICKY HEADER */}
        <Header onMenuClick={() => setDrawerOpen(true)} />

        {/* ONLY THIS AREA SCROLLS */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden industrial-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
