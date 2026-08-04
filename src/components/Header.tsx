import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch';
import Avatar from './Avatar';
import SearchBar from './SearchBar';
import NotificationItem from './NotificationItem';
import Button from './Button';
import { useAuth } from '../auth/useAuth';
import useGlobalSearch from '../hooks/useGlobalSearch';
import {
  Bell,
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  PackagePlus,
  PenTool,
  Settings,
  User,
} from 'lucide-react';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [search, setSearch] = React.useState('');
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { results, loading: searchLoading } = useGlobalSearch(search);
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const quickRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!notificationRef.current?.contains(target)) setNotificationsOpen(false);
      if (!profileRef.current?.contains(target)) setProfileOpen(false);
      if (!quickRef.current?.contains(target)) setQuickOpen(false);
      if (!searchRef.current?.contains(target)) setSearchOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-surface-raised/95 shadow-header backdrop-blur-sm">
      <div className="flex h-16 min-w-0 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-charcoal-light transition-colors hover:border-primary hover:text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 flex-1 lg:block">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span>Admin</span>
            <span>/</span>
            <span className="text-charcoal">Dashboard</span>
          </nav>
          <div className="mt-0.5 font-heading text-lg font-semibold text-charcoal">
            Website Operations
          </div>
        </div>

        <div className="relative min-w-0 flex-1 lg:max-w-md" ref={searchRef}>
          <SearchBar
            aria-label="Global search"
            placeholder="Search products, materials, leads..."
            containerClassName="h-10"
            value={search}
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              setSearch(event.target.value);
              setSearchOpen(true);
            }}
          />
          {searchOpen && search.trim() && (
            <div className="absolute left-0 right-0 top-12 z-30 border border-border bg-surface-raised shadow-card-hover">
              <div className="border-b border-divider px-3 py-2 text-xs font-semibold text-muted-foreground">
                {searchLoading
                  ? 'Searching local records...'
                  : `${results.length} matching records`}
              </div>
              {results.length > 0 ? (
                <div className="max-h-80 overflow-y-auto industrial-scrollbar py-1">
                  {results.map(({ resource, row }) => (
                    <button
                      key={`${resource.key}-${row.id}`}
                      type="button"
                      onClick={() => {
                        navigate(`${resource.basePath}/${row.id}`);
                        setSearchOpen(false);
                        setSearch('');
                      }}
                      className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-surface-subtle"
                    >
                      <resource.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-charcoal">
                          {row.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {resource.title} / {row.id}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                !searchLoading && (
                  <div className="px-3 py-4 text-sm text-muted-foreground">
                    No local records match this search.
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="relative hidden items-center gap-2 xl:flex" ref={quickRef}>
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={() => setQuickOpen((state) => !state)}
          >
            <PackagePlus />
            Quick Action
          </Button>
          {quickOpen && (
            <div className="absolute right-0 top-12 z-30 w-60 border border-border bg-surface-raised py-1 shadow-card-hover">
              {[
                { label: 'New product draft', icon: PackagePlus, to: '/products/new' },
                { label: 'Review quote requests', icon: FileText, to: '/quote-requests' },
                { label: 'Open drawing queue', icon: PenTool, to: '/drawing-requests' },
              ].map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    navigate(item.to);
                    setQuickOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-charcoal-light hover:bg-surface-subtle hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((state) => !state)}
            className="relative flex h-10 w-10 items-center justify-center border border-border bg-surface text-charcoal-light transition-colors hover:border-primary hover:text-primary"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 bg-primary" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-30 w-[min(92vw,380px)] border border-border bg-surface-raised shadow-card-hover">
              <div className="border-b border-divider px-4 py-3">
                <p className="font-heading text-base font-semibold text-charcoal">Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Operational alerts and lead activity
                </p>
              </div>
              <NotificationItem
                unread
                title="New drawing request"
                description="Kanpur Foods uploaded a conveyor guide rail drawing."
                time="8m"
                icon={<PenTool className="h-4 w-4" />}
              />
              <NotificationItem
                title="Brochure downloaded"
                description="POLYRIB V datasheet accessed by an automotive lead."
                time="31m"
                icon={<FileText className="h-4 w-4" />}
              />
              <NotificationItem
                title="System check complete"
                description="Website, storage, and database services are healthy."
                time="1h"
                icon={<Settings className="h-4 w-4" />}
              />
            </div>
          )}
        </div>

        <ThemeSwitch />

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((state) => !state)}
            className="flex h-10 items-center gap-2 border border-border bg-surface px-2 text-left transition-colors hover:border-primary"
          >
            <Avatar name={user?.name ?? 'Super Admin'} size="sm" />
            <span className="hidden min-w-0 md:block">
              <span className="block truncate text-sm font-semibold text-charcoal">
                {user?.name ?? 'Super Admin'}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {user?.role?.replace('_', ' ') ?? 'super admin'}
              </span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-primary md:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 z-30 w-56 border border-border bg-surface-raised py-1 shadow-card-hover">
              <button
                type="button"
                onClick={() => {
                  navigate('/users');
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-charcoal-light hover:bg-surface-subtle hover:text-primary"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/settings');
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-charcoal-light hover:bg-surface-subtle hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 border-t border-divider px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-surface-subtle dark:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
