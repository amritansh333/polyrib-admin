import React from 'react';
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  PackageCheck,
  Shield,
} from 'lucide-react';
import polyribLogo from '../assets/polyrib.png';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { sidebarSections, type SidebarItem } from '../constants/navigation';

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
  const location = useLocation();
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const nextExpanded: Record<string, boolean> = {};
    sidebarSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children?.some((child) => isPathActive(location.pathname, child.to))) {
          nextExpanded[item.to] = true;
        }
      });
    });
    setExpanded((current) => ({ ...current, ...nextExpanded }));
  }, [location.pathname]);

  return (
    <aside
      className={clsx(
        'sticky top-0 flex h-screen shrink-0 flex-col border-r border-divider bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] transition-all duration-300',
        compact ? 'w-20' : 'w-72',
        mobile ? 'h-full w-full border-r-0' : 'hidden lg:flex'
      )}
    >
      <div className="flex h-20 border-b border-divider">
        {/* POLYRIB Logo */}
        <div
          className={clsx(
            'flex min-w-0 flex-1 items-center overflow-hidden',
            compact ? 'justify-center px-2' : 'px-3'
          )}
        >
          <img
            src={polyribLogo}
            alt="Khanna Polyrib Pvt. Ltd."
            className={clsx('block object-contain', compact ? 'h-12 w-12' : 'h-full w-full')}
          />
        </div>

        {/* Collapse / Expand Button */}
        {!mobile && (
          <div className="flex w-[52px] shrink-0 items-center justify-center">
            <button
              type="button"
              onClick={() => onCollapseChange(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="flex h-9 w-9 items-center justify-center border border-border text-charcoal-light transition-colors hover:border-primary hover:text-primary"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        )}
      </div>
      {/*
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

         */}

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
                  <SidebarLink
                    key={item.to}
                    item={item}
                    compact={compact}
                    pathname={location.pathname}
                    expanded={Boolean(expanded[item.to])}
                    onToggle={() =>
                      setExpanded((current) => ({ ...current, [item.to]: !current[item.to] }))
                    }
                    onNavigate={onNavigate}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
      {/*
      <div className="border-t border-divider p-4">
        <div className={clsx('grid gap-2', compact ? 'grid-cols-1' : 'grid-cols-3')}>
          {[
            { label: 'Site', value: 'Live', icon: BarChart3 },
            { label: 'DB', value: 'Local', icon: Database },
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
      */}
    </aside>
  );
}

function SidebarLink({
  item,
  compact,
  pathname,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: SidebarItem;
  compact: boolean;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);
  const active =
    isPathActive(pathname, item.to) ||
    item.children?.some((child) => isPathActive(pathname, child.to));

  return (
    <li>
      <div className="relative">
        <NavLink
          to={item.to}
          onClick={onNavigate}
          className={clsx(
            'group flex h-10 items-center gap-3 border px-3 text-sm font-semibold transition-all duration-200',
            compact && 'justify-center px-0',
            active
              ? 'border-primary/20 bg-primary text-primary-foreground shadow-card'
              : 'border-transparent text-charcoal-light hover:border-primary/25 hover:bg-[hsl(var(--sidebar-muted))] hover:text-primary'
          )}
          title={compact ? item.label : undefined}
        >
          <item.icon
            className={clsx(
              'h-4 w-4 shrink-0',
              active ? 'text-primary-foreground' : 'text-primary'
            )}
            strokeWidth={1.8}
          />
          {!compact && <span className="truncate pr-7">{item.label}</span>}
        </NavLink>
        {hasChildren && !compact && (
          <button
            type="button"
            aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
            aria-expanded={expanded}
            onClick={onToggle}
            className={clsx(
              'absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center transition-colors',
              active ? 'text-primary-foreground' : 'text-primary'
            )}
          >
            <ChevronDown
              className={clsx('h-4 w-4 transition-transform', expanded && 'rotate-180')}
            />
          </button>
        )}
      </div>
      {hasChildren && expanded && !compact && (
        <ul className="ml-4 mt-1 space-y-1 border-l border-divider pl-3">
          {item.children?.map((child) => (
            <li key={child.to}>
              <NavLink
                to={child.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  clsx(
                    'flex h-9 items-center gap-2 border border-transparent px-3 text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-charcoal-light hover:border-primary/25 hover:bg-[hsl(var(--sidebar-muted))] hover:text-primary'
                  )
                }
              >
                <child.icon className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.8} />
                <span className="truncate">{child.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function isPathActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}
