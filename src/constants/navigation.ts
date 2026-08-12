import {
  BookOpen,
  Building2,
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
  Tags,
  UserCog,
  Users,
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
      { label: 'Brands', to: '/brands', icon: Tags },
      { label: 'Categories', to: '/categories', icon: FolderTree },
      { label: 'Subcategories', to: '/subcategories', icon: FolderTree },
      { label: 'Materials', to: '/materials', icon: Layers },
      { label: 'Industries', to: '/industries', icon: Building2 },
      { label: 'Media Library', to: '/media-library', icon: Image },
    ],
  },
  {
    label: 'Leads',
    items: [
      { label: 'Leads', to: '/leads', icon: FileDown },
      { label: 'Enquiries', to: '/enquiries', icon: FileText },
      { label: 'Drawing Requests', to: '/drawing-requests', icon: PenTool },
      { label: 'Catalog Requests', to: '/catalogrequests', icon: FileText },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Blog & Gallery', to: '/blog', icon: ScrollText },
      { label: 'Website Content', to: '/content', icon: BookOpen },
      { label: 'Users', to: '/users', icon: UserCog },
      { label: 'Roles & Permissions', to: '/roles', icon: LockKeyhole },
    ],
  },
];
