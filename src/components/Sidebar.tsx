import React from 'react';
import {
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  ChevronLeft,
  ChevronRight,
  Database,
  FileDown,
  FileText,
  FolderTree,
  Gauge,
  HelpCircle,
  Image,
  Layers,
  Library,
  LockKeyhole,
  Package,
  PackageCheck,
  PenTool,
  ScrollText,
  Settings,
  Shield,
  Tags,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

type SidebarItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

type SidebarSection = {
  label: string;
  items: SidebarItem[];
};

const sidebarSections: SidebarSection[] = [
  {
    label: 'Command',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: Gauge }],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Products', to: '/dashboard/products', icon: Package },
      { label: 'Categories', to: '/dashboard/categories', icon: FolderTree },
      { label: 'Brands', to: '/dashboard/brands', icon: Tags },
      { label: 'Machine Components', to: '/dashboard/machine-components', icon: Wrench },
      { label: 'Semi Finished Products', to: '/dashboard/semi-finished-products', icon: Boxes },
      { label: 'Materials', to: '/dashboard/materials', icon: Layers },
      { label: 'Media Library', to: '/dashboard/media', icon: Image },
    ],
  },
  {
    label: 'Leads',
    items: [
      { label: 'Leads', to: '/dashboard/leads', icon: Users },
      { label: 'Brochure Downloads', to: '/dashboard/brochure-downloads', icon: FileDown },
      { label: 'Drawing Requests', to: '/dashboard/drawing-requests', icon: PenTool },
      { label: 'Quote Requests', to: '/dashboard/quote-requests', icon: FileText },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Website Content', to: '/dashboard/content', icon: BookOpen },
      { label: 'Users', to: '/dashboard/users', icon: UserCog },
      { label: 'Roles & Permissions', to: '/dashboard/roles', icon: LockKeyhole },
      { label: 'Settings', to: '/dashboard/settings', icon: Settings },
      { label: 'System Logs', to: '/dashboard/system-logs', icon: ScrollText },
      { label: 'Support', to: '/dashboard/support', icon: HelpCircle },
    ],
  },
];

export default function Sidebar({
  collapsed,
  onCollapseChange,
  mobile = false,
  onNavigate,
}: {
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const compact = collapsed && !mobile;

  return (
    <aside
      className={clsx(
        'flex h-screen shrink-0 flex-col border-r border-divider bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] transition-all duration-300',
        compact ? 'w-20' : 'w-72',
        mobile ? 'h-full w-full border-r-0' : 'hidden lg:flex'
      )}
    >
      <div className="flex h-20 items-center gap-3 border-b border-divider px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary font-heading text-sm font-bold text-primary-foreground shadow-card">
            KP
          </div>
          {!compact && (
            <div className="min-w-0">
              <div className="truncate font-heading text-lg font-bold text-charcoal">
                Khanna Polyrib
              </div>
              <div className="truncate text-[10px] font-bold uppercase tracking-widest text-primary">
                Manufacturing CMS
              </div>
            </div>
          )}
        </div>
        {!mobile && (
          <button
            type="button"
            onClick={() => onCollapseChange(!collapsed)}
            aria-label="Collapse sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-border text-charcoal-light transition-colors hover:border-primary hover:text-primary"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      <div className="border-b border-divider px-4 py-4">
        <div
          className={clsx(
            'border border-primary/15 bg-primary/5 p-3',
            compact && 'flex justify-center p-2'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            {!compact && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-widest text-primary">
                  Kanpur HQ
                </p>
                <p className="truncate text-xs text-muted-foreground">Internal ERP console</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4 industrial-scrollbar">
        <div className="space-y-6">
          {sidebarSections.map((section) => (
            <div key={section.label}>
              {!compact && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {section.label}
                </p>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        clsx(
                          'group flex h-10 items-center gap-3 border border-transparent px-3 text-sm font-semibold transition-all duration-200',
                          compact && 'justify-center px-0',
                          isActive
                            ? 'border-primary/20 bg-primary text-primary-foreground shadow-card'
                            : 'text-charcoal-light hover:border-primary/25 hover:bg-[hsl(var(--sidebar-muted))] hover:text-primary'
                        )
                      }
                      title={compact ? item.label : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={clsx(
                              'h-4 w-4 shrink-0',
                              isActive ? 'text-primary-foreground' : 'text-primary'
                            )}
                            strokeWidth={1.8}
                          />
                          {!compact && <span className="truncate">{item.label}</span>}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-divider p-4">
        <div className={clsx('grid gap-2', compact ? 'grid-cols-1' : 'grid-cols-3')}>
          {[
            { label: 'Site', value: 'Live', icon: BarChart3 },
            { label: 'DB', value: 'OK', icon: Database },
            { label: 'RA', value: 'On', icon: Shield },
          ].map((item) => (
            <div
              key={item.label}
              className="border border-border bg-surface px-2 py-2 text-center shadow-card"
              title={`${item.label}: ${item.value}`}
            >
              <item.icon className="mx-auto h-3.5 w-3.5 text-primary" />
              {!compact && (
                <>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs font-semibold text-charcoal">{item.value}</p>
                </>
              )}
            </div>
          ))}
        </div>
        {!compact && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <PackageCheck className="h-3.5 w-3.5 text-primary" />
            Catalog sync ready
            <Bell className="ml-auto h-3.5 w-3.5 text-primary" />
          </div>
        )}
      </div>
    </aside>
  );
}
