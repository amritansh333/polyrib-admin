import {
  BookOpen,
  Boxes,
  FileDown,
  FileText,
  FolderTree,
  Gauge,
  HelpCircle,
  Image,
  Layers,
  LockKeyhole,
  Package,
  PenTool,
  ScrollText,
  Settings,
  Tags,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';

export type SidebarItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children?: SidebarItem[];
};

export type SidebarSection = {
  label: string;
  items: SidebarItem[];
};

export const sidebarSections: SidebarSection[] = [
  {
    label: 'Command',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: Gauge }],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Products', to: '/products', icon: Package },
      { label: 'Categories', to: '/categories', icon: FolderTree },
      { label: 'Brands', to: '/brands', icon: Tags },
      { label: 'Machine Components', to: '/machine-components', icon: Wrench },
      { label: 'Semi Finished Products', to: '/semi-finished-products', icon: Boxes },
      { label: 'Materials', to: '/materials', icon: Layers },
      { label: 'Media Library', to: '/media-library', icon: Image },
    ],
  },
  {
    label: 'Leads',
    items: [
      { label: 'Leads', to: '/leads', icon: Users },
      { label: 'Brochure Downloads', to: '/brochure-downloads', icon: FileDown },
      { label: 'Drawing Requests', to: '/drawing-requests', icon: PenTool },
      { label: 'Quote Requests', to: '/quote-requests', icon: FileText },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Website Content', to: '/content', icon: BookOpen },
      { label: 'Users', to: '/users', icon: UserCog },
      { label: 'Roles & Permissions', to: '/roles', icon: LockKeyhole },
      {
        label: 'Settings',
        to: '/settings',
        icon: Settings,
        children: [
          { label: 'System Logs', to: '/system-logs', icon: ScrollText },
          { label: 'Support', to: '/support', icon: HelpCircle },
        ],
      },
    ],
  },
];
