import {
  BookOpen,
  Boxes,
  Building2,
  FileDown,
  FileText,
  FolderTree,
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
import type { DataEntity, ResourceConfig } from '../types/admin';

const now = '2026-08-04';

export const resources: ResourceConfig[] = [
  {
    key: 'products',
    title: 'Products',
    eyebrow: 'Catalog',
    description: 'Manage finished catalog records across Polyrib product families.',
    basePath: '/products',
    createPath: '/products/new',
    newLabel: 'New Product',
    searchPlaceholder: 'Search products, brands, grades...',
    icon: Package,
    filters: [
      { label: 'All products', value: 'all' },
      { label: 'Published', value: 'Published' },
      { label: 'Review', value: 'Review' },
      { label: 'Draft', value: 'Draft' },
    ],
  },
  {
    key: 'categories',
    title: 'Categories',
    eyebrow: 'Catalog',
    description: 'Organize public product taxonomy and landing page groups.',
    basePath: '/categories',
    createPath: '/categories/new',
    newLabel: 'New Category',
    searchPlaceholder: 'Search categories...',
    icon: FolderTree,
    filters: [
      { label: 'All categories', value: 'all' },
      { label: 'Published', value: 'Published' },
      { label: 'Review', value: 'Review' },
    ],
  },
  {
    key: 'industries',
    title: 'Industries',
    eyebrow: 'Catalog',
    description: 'Manage industry classifications, SEO copy, and public-market filters.',
    basePath: '/industries',
    createPath: '/industries/new',
    newLabel: 'New Industry',
    searchPlaceholder: 'Search industries...',
    icon: Building2,
    filters: [
      { label: 'All industries', value: 'all' },
      { label: 'Published', value: 'Published' },
      { label: 'Review', value: 'Review' },
    ],
  },
  {
    key: 'subcategories',
    title: 'Subcategories',
    eyebrow: 'Catalog',
    description: 'Subcategory landing groups within categories.',
    basePath: '/subcategories',
    createPath: '/subcategories/new',
    newLabel: 'New Subcategory',
    searchPlaceholder: 'Search subcategories...',
    icon: FolderTree,
    filters: [{ label: 'All subcategories', value: 'all' }],
  },
  {
    key: 'brands',
    title: 'Brands',
    eyebrow: 'Brand Portfolio',
    description: 'Maintain Polyrib brand families, labels, and market positioning.',
    basePath: '/brands',
    createPath: '/brands/new',
    newLabel: 'New Brand',
    searchPlaceholder: 'Search brands...',
    icon: Tags,
    filters: [
      { label: 'All brands', value: 'all' },
      { label: 'Active', value: 'Active' },
      { label: 'Review', value: 'Review' },
    ],
  },
  {
    key: 'materials',
    title: 'Materials',
    eyebrow: 'Technical Library',
    description: 'Maintain thermoplastic material families, grades, and usage guidance.',
    basePath: '/materials',
    createPath: '/materials/new',
    newLabel: 'New Material',
    searchPlaceholder: 'Search materials and grades...',
    icon: Layers,
    filters: [
      { label: 'All materials', value: 'all' },
      { label: 'Published', value: 'Published' },
      { label: 'Review', value: 'Review' },
    ],
  },
  {
    key: 'machine-components',
    title: 'Machine Components',
    eyebrow: 'Product Division',
    description: 'Manage machined, formed, and application-ready industrial components.',
    basePath: '/machine-components',
    searchPlaceholder: 'Search machine components...',
    icon: Wrench,
    filters: [
      { label: 'All components', value: 'all' },
      { label: 'Published', value: 'Published' },
      { label: 'Review', value: 'Review' },
    ],
  },
  {
    key: 'semi-finished-products',
    title: 'Semi Finished Products',
    eyebrow: 'Product Division',
    description: 'Manage sheet, block, rod, tube, coil, roll, and welding rod records.',
    basePath: '/semi-finished-products',
    searchPlaceholder: 'Search semi finished products...',
    icon: Boxes,
    filters: [
      { label: 'All products', value: 'all' },
      { label: 'Published', value: 'Published' },
      { label: 'Draft', value: 'Draft' },
    ],
  },
  {
    key: 'media-library',
    title: 'Media Library',
    eyebrow: 'Assets',
    description: 'Govern product imagery, brochures, datasheets, and engineering uploads.',
    basePath: '/media-library',
    createPath: '/media-library/upload',
    newLabel: 'Upload Asset',
    searchPlaceholder: 'Search media assets...',
    icon: Image,
    filters: [
      { label: 'All assets', value: 'all' },
      { label: 'Images', value: 'Image' },
      { label: 'Documents', value: 'Document' },
    ],
  },
  {
    key: 'leads',
    title: 'Leads',
    eyebrow: 'Lead Intelligence',
    description: 'Track verified document access and product interest signals.',
    basePath: '/leads',
    searchPlaceholder: 'Search downloads...',
    icon: FileDown,
    filters: [
      { label: 'All leads', value: 'all' },
      { label: 'Active', value: 'Active' },
    ],
  },
  {
    key: 'drawing-requests',
    title: 'Drawing Requests',
    eyebrow: 'Engineering Queue',
    description: 'Review uploaded drawings for custom machined component quotations.',
    basePath: '/drawing-requests',
    searchPlaceholder: 'Search drawing requests...',
    icon: PenTool,
    filters: [
      { label: 'All drawings', value: 'all' },
      { label: 'New', value: 'NEW' },
      { label: 'Under review', value: 'UNDER_REVIEW' },
      { label: 'Quoted', value: 'QUOTED' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Rejected', value: 'REJECTED' },
    ],
  },
  {
    key: 'enquiries',
    title: 'Enquiries',
    eyebrow: 'Sales Queue',
    description: 'Customer contact enquiries submitted via the website contact and quote forms.',
    basePath: '/enquiries',
    searchPlaceholder: 'Search enquiries...',
    icon: FileText,
    filters: [
      { label: 'All enquiries', value: 'all' },
      { label: 'New', value: 'New' },
      { label: 'Contacted', value: 'Contacted' },
      { label: 'In Progress', value: 'In Progress' },
      { label: 'Resolved', value: 'Resolved' },
      { label: 'Closed', value: 'Closed' },
    ],
  },

  {
    key: 'content',
    title: 'Website Content',
    eyebrow: 'CMS',
    description: 'Maintain public pages, industry sections, resource copy, and CTAs.',
    basePath: '/content',
    searchPlaceholder: 'Search content entries...',
    icon: BookOpen,
    filters: [
      { label: 'All pages', value: 'all' },
      { label: 'Published', value: 'Published' },
      { label: 'Review', value: 'Review' },
    ],
  },
  {
    key: 'blog',
    title: 'Blog & Gallery',
    eyebrow: 'Website Content',
    description: 'Manage blog articles, galleries, featured images, and publication settings.',
    basePath: '/blog',
    createPath: '/blog/new',
    newLabel: 'New Post',
    searchPlaceholder: 'Search blog posts, categories, tags...',
    icon: ScrollText,
    filters: [
      { label: 'All posts', value: 'all' },
      { label: 'Published', value: 'published' },
      { label: 'Draft', value: 'draft' },
    ],
  },
  {
    key: 'users',
    title: 'Users',
    eyebrow: 'Access Control',
    description: 'Manage internal users assigned to catalog, sales, content, and system roles.',
    basePath: '/users',
    createPath: '/users/new',
    newLabel: 'New User',
    searchPlaceholder: 'Search users...',
    icon: UserCog,
    filters: [
      { label: 'All users', value: 'all' },
      { label: 'Active', value: 'Active' },
      { label: 'Pending', value: 'Pending' },
    ],
  },
  {
    key: 'roles',
    title: 'Roles & Permissions',
    eyebrow: 'Access Control',
    description: 'Review internal permission sets for CMS and operational workflows.',
    basePath: '/roles',
    searchPlaceholder: 'Search roles...',
    icon: LockKeyhole,
    filters: [
      { label: 'All roles', value: 'all' },
      { label: 'Active', value: 'Active' },
    ],
  },
  {
    key: 'settings',
    title: 'Settings',
    eyebrow: 'System',
    description: 'Configure admin preferences, notifications, publishing, and security controls.',
    basePath: '/settings',
    searchPlaceholder: 'Search settings...',
    icon: Settings,
    filters: [
      { label: 'All settings', value: 'all' },
      { label: 'Active', value: 'Active' },
    ],
  },
  {
    key: 'system-logs',
    title: 'System Logs',
    eyebrow: 'System',
    description: 'Audit administrative events, publishing operations, and security activity.',
    basePath: '/system-logs',
    searchPlaceholder: 'Search log events...',
    icon: ScrollText,
    filters: [
      { label: 'All logs', value: 'all' },
      { label: 'Active', value: 'Active' },
    ],
  },
  {
    key: 'support',
    title: 'Support',
    eyebrow: 'Operations',
    description: 'Review internal support workflows, catalog issues, and escalation records.',
    basePath: '/support',
    searchPlaceholder: 'Search support records...',
    icon: HelpCircle,
    filters: [
      { label: 'All support', value: 'all' },
      { label: 'Active', value: 'Active' },
      { label: 'Pending', value: 'Pending' },
    ],
  },
];

export const mockData: Record<string, DataEntity[]> = {
  products: [
    entity(
      'P-1001',
      'POLYRIB V UHMW PE Sheet',
      'Abrasion resistant sheets for conveyor and lining applications.',
      'Published',
      'Catalog Team',
      'Sheets & Blocks',
      'POLYRIB V',
      'UHMW PE'
    ),
    entity(
      'P-1002',
      'PCCLEAR UV Light Sheet',
      'Transparent UV stabilized polycarbonate sheet for roofing and glazing.',
      'Published',
      'Anita Verma',
      'Sheets & Blocks',
      'PCCLEAR',
      'PC'
    ),
    entity(
      'P-1003',
      'PLASCON-V Stress Relieved Rod',
      'Machining-grade UHMW PE rod with improved dimensional stability.',
      'Review',
      'Engineering',
      'Rods & Tubes',
      'PLASCON V',
      'UHMW PE'
    ),
    entity(
      'P-1004',
      'CUTRITE Embossed Chopping Board',
      'LDPE chopping board surface for food processing workstations.',
      'Draft',
      'Catalog Team',
      'Machine Components',
      'CUTRITE',
      'LDPE'
    ),
    entity(
      'P-1005',
      'ARETE Silo Lining Sheet',
      'Low-friction industrial liner for bulk material handling.',
      'Published',
      'Rohit Singh',
      'Lining Materials',
      'ARETE',
      'UHMW PE'
    ),
    entity(
      'P-1006',
      'KAYLON Oilon Cast Nylon Tube',
      'Oil-filled cast nylon tube for bushings and bearings.',
      'Published',
      'Engineering',
      'Rods & Tubes',
      'KAYLON',
      'PA6'
    ),
  ],
  categories: [
    entity(
      'C-201',
      'Thermoplastic Semi Finished Products',
      'Sheets, rods, tubes, rolls, welding rods, and blocks.',
      'Published',
      'Catalog Team',
      'Products'
    ),
    entity(
      'C-202',
      'Thermoplastic Machine Components',
      'Machined and fabricated engineering plastic components.',
      'Published',
      'Catalog Team',
      'Products'
    ),
    entity(
      'C-203',
      'Application Ready Sheets',
      'Cut-to-size and application-specific sheet formats.',
      'Review',
      'Engineering',
      'Machine Components'
    ),
    entity(
      'C-204',
      'Industrial Liners',
      'Lining materials for bulk handling and chemical environments.',
      'Published',
      'Rohit Singh',
      'Materials'
    ),
  ],
  brands: [
    entity(
      'B-301',
      'POLYRIB V',
      'UHMW PE material family for sliding, wear, and impact duty.',
      'Active',
      'Brand Team',
      'Material Brands',
      'POLYRIB V',
      'UHMW PE'
    ),
    entity(
      'B-302',
      'PCCLEAR',
      'Polycarbonate sheets for transparent industrial applications.',
      'Active',
      'Brand Team',
      'Material Brands',
      'PCCLEAR',
      'PC'
    ),
    entity(
      'B-303',
      'KAYLON',
      'Cast nylon stock shapes for precision machining.',
      'Active',
      'Brand Team',
      'Material Brands',
      'KAYLON',
      'PA6'
    ),
    entity(
      'B-304',
      'DIPRA',
      'Speciality PP sheets and UV stabilized grades.',
      'Review',
      'Brand Team',
      'Material Brands',
      'DIPRA',
      'PP'
    ),
  ],
  materials: [
    entity(
      'M-401',
      'UHMW PE',
      'Self-lubricating material with outstanding abrasion resistance.',
      'Published',
      'Engineering',
      'Polyethylene',
      'POLYRIB V',
      'UHMW PE'
    ),
    entity(
      'M-402',
      'Polycarbonate',
      'High-clarity impact resistant thermoplastic sheet family.',
      'Published',
      'Engineering',
      'Engineering Plastics',
      'PCCLEAR',
      'PC'
    ),
    entity(
      'M-403',
      'Polypropylene',
      'Chemical-resistant lightweight thermoplastic for tanks and liners.',
      'Review',
      'Engineering',
      'Polyolefins',
      'POLYRIB P',
      'PP'
    ),
    entity(
      'M-404',
      'Cast Nylon',
      'High strength material for gears, pads, and bearings.',
      'Published',
      'Engineering',
      'Polyamide',
      'KAYLON',
      'PA6'
    ),
  ],
  'machine-components': [
    entity(
      'MC-501',
      'RIPLA Cutting Board',
      'Impact resistant industrial cutting board for food processing.',
      'Published',
      'Machine Components',
      'Cutting Boards',
      'RIPLA',
      'PP'
    ),
    entity(
      'MC-502',
      'Chain Guide Profile',
      'Machined UHMW PE guide profile for conveyors.',
      'Review',
      'Engineering',
      'Strips & Profiles',
      'POLYRIB V',
      'UHMW PE'
    ),
    entity(
      'MC-503',
      'Vacuum Formed Plastic Part',
      'Custom formed thermoplastic housing for industrial equipment.',
      'Published',
      'Engineering',
      'Vacuum Formed Parts',
      'POLYRIB H',
      'HDPE'
    ),
    entity(
      'MC-504',
      'ARETE Hopper Liner',
      'Low-friction liner component for high volume discharge.',
      'Published',
      'Machine Components',
      'Liners',
      'ARETE',
      'UHMW PE'
    ),
  ],
  'semi-finished-products': [
    entity(
      'SF-601',
      'Compression Moulded Sheet',
      'Heavy gauge sheet stock for machining and fabrication.',
      'Published',
      'Catalog Team',
      'Sheets & Blocks',
      'POLYRIB V',
      'UHMW PE'
    ),
    entity(
      'SF-602',
      'Extruded HDPE Rod',
      'Standard diameter HDPE rod for industrial fabrication.',
      'Published',
      'Catalog Team',
      'Rods & Tubes',
      'POLYRIB H',
      'HDPE'
    ),
    entity(
      'SF-603',
      'Polypropylene Welding Rod',
      'PP welding rod for tank fabrication and repair.',
      'Draft',
      'Catalog Team',
      'Welding Rods',
      'POLYRIB P',
      'PP'
    ),
    entity(
      'SF-604',
      'Polycarbonate Roll',
      'Roll stock for glazing and formed applications.',
      'Review',
      'Catalog Team',
      'Coils & Rolls',
      'PCCLEAR',
      'PC'
    ),
  ],
  'media-library': [
    media(
      'A-701',
      'Polyrib Master Product Catalogue.pdf',
      'Corporate product catalogue PDF.',
      'Document',
      '8.4 MB'
    ),
    media(
      'A-702',
      'RIPLA Cutting Boards Catalogue.pdf',
      'Machine component brochure.',
      'Document',
      '4.1 MB'
    ),
    media(
      'A-703',
      'POLYRIB V sheet stack image.jpg',
      'Product image for UHMW PE sheets.',
      'Image',
      '1.8 MB'
    ),
    media(
      'A-704',
      'ARETE liner installation.jpg',
      'Application photo for bulk handling liners.',
      'Image',
      '2.6 MB'
    ),
  ],
  leads: [
    lead(
      'L-801',
      'Apex Food Systems',
      'Neeraj Sharma',
      'neeraj@apexfood.example',
      'RIPLA cutting boards',
      'Quote form',
      'Pending'
    ),
    lead(
      'L-802',
      'Bharat Cement Works',
      'Megha Rao',
      'megha@bharatcement.example',
      'ARETE silo liners',
      'Brochure',
      'Active'
    ),
    lead(
      'L-803',
      'Narmada Packaging',
      'Vikram Jain',
      'vikram@narmadapack.example',
      'POLYRIB V wear strips',
      'Material selector',
      'Pending'
    ),
    lead(
      'L-804',
      'Skybuild Panels',
      'Karan Mehta',
      'karan@skybuild.example',
      'PCCLEAR UV sheets',
      'Contact form',
      'Closed'
    ),
  ],
  downloads: [
    download('D-901', 'Polyrib Master Product Catalogue', 'Mecpro Conveyors', 'Gujarat', 438),
    download('D-902', 'Ripla Cutting Boards Catalogue', 'Apex Food Systems', 'Uttar Pradesh', 267),
    download('D-903', 'Arete Lining Materials Catalogue', 'Eastern Minerals', 'Odisha', 219),
    download('D-904', 'PCCLEAR Sheets Catalogue', 'Skybuild Panels', 'Maharashtra', 184),
  ],
  'drawing-requests': [
    request(
      'DR-1001',
      'Conveyor Guide Rail Drawing',
      'Kanpur Foods',
      'Custom UHMW PE guide rail drawing uploaded for quote.',
      'Pending'
    ),
    request(
      'DR-1002',
      'Bottle Star Wheel Profile',
      'Aarav Beverages',
      'DXF supplied for machined acetal star wheel.',
      'Pending'
    ),
    request(
      'DR-1003',
      'Vacuum Formed Cover',
      'Zenith Equipment',
      'STEP file for formed HDPE equipment cover.',
      'Closed'
    ),
  ],
  enquiries: [
    request(
      'QR-1101',
      'PCCLEAR roofing sheet enquiry',
      'Skybuild Panels',
      '500 sheets with UV stabilized grade requirement.',
      'Pending'
    ),
    request(
      'QR-1102',
      'POLYRIB V wear strip enquiry',
      'Mecpro Conveyors',
      'Guide strip and rail dimensions requested.',
      'Pending'
    ),
    request(
      'QR-1103',
      'KAYLON bearing stock quote',
      'Shakti Drives',
      'Cast nylon tube and rod quote for machining.',
      'Closed'
    ),
  ],
  content: [
    entity(
      'PAGE-1201',
      'Products Landing Page',
      'Main catalog entry point with two product divisions.',
      'Published',
      'Content Team',
      'Page'
    ),
    entity(
      'PAGE-1202',
      'Materials Page',
      'Material family overview and technical property sections.',
      'Published',
      'Content Team',
      'Page'
    ),
    entity(
      'PAGE-1203',
      'Resources & Downloads',
      'Brochure catalogue and gated download experience.',
      'Review',
      'Content Team',
      'Page'
    ),
    entity(
      'PAGE-1204',
      'Contact Page',
      'Quote and drawing request conversion page.',
      'Published',
      'Content Team',
      'Page'
    ),
  ],
  users: [
    user('U-1301', 'Super Admin', 'super@polyrib.local', 'System Administrator', 'Active'),
    user('U-1302', 'Catalog Manager', 'catalog@polyrib.local', 'Catalog Editor', 'Active'),
    user('U-1303', 'Sales Engineer', 'sales@polyrib.local', 'Lead Manager', 'Active'),
    user('U-1304', 'Content Reviewer', 'content@polyrib.local', 'Content Reviewer', 'Pending'),
  ],
  roles: [
    role('R-1401', 'Super Administrator', 'Full internal ERP and CMS permissions.'),
    role('R-1402', 'Catalog Editor', 'Create and edit catalog records, brands, and materials.'),
    role('R-1403', 'Lead Manager', 'View leads, downloads, drawings, and quote requests.'),
    role('R-1404', 'Content Reviewer', 'Review and publish public website content.'),
  ],
  settings: [
    entity(
      'SET-1501',
      'Publishing Approval',
      'Require reviewer approval before public catalog publishing.',
      'Active',
      'System',
      'Governance'
    ),
    entity(
      'SET-1502',
      'Lead Notification Routing',
      'Send commercial requests to sales engineering queue.',
      'Active',
      'System',
      'Notifications'
    ),
    entity(
      'SET-1503',
      'Media Storage Policy',
      'Store product media and technical PDFs in external storage.',
      'Active',
      'System',
      'Storage'
    ),
  ],
  'system-logs': [
    log('LOG-1601', 'Catalog export generated', 'Super Admin generated a product snapshot export.'),
    log(
      'LOG-1602',
      'Product draft created',
      'Catalog Manager created PLASCON-V Stress Relieved Rod.'
    ),
    log(
      'LOG-1603',
      'Role permissions reviewed',
      'Super Admin reviewed Content Reviewer permissions.'
    ),
  ],
};

mockData.support = [
  entity(
    'SUP-1701',
    'CMS Support Desk',
    'Internal operating procedure for admin support and escalation.',
    'Active',
    'System',
    'Support'
  ),
  entity(
    'SUP-1702',
    'Catalog Issue Queue',
    'Track public catalog content issues raised by sales teams.',
    'Pending',
    'System',
    'Support'
  ),
];

function entity(
  id: string,
  name: string,
  description: string,
  status: DataEntity['status'],
  owner: string,
  category?: string,
  brand?: string,
  material?: string
): DataEntity {
  return {
    id,
    name,
    description,
    status,
    owner,
    category,
    brand,
    material,
    createdAt: '2026-07-18',
    updatedAt: now,
  };
}

function media(
  id: string,
  name: string,
  description: string,
  category: string,
  size: string
): DataEntity {
  return {
    ...entity(id, name, description, 'Active', 'Media Team', category),
    size,
  };
}

function lead(
  id: string,
  company: string,
  contact: string,
  email: string,
  interest: string,
  source: string,
  status: DataEntity['status']
): DataEntity {
  return {
    ...entity(id, company, interest, status, 'Sales Team', 'Lead'),
    company,
    name: contact,
    email,
    source,
    phone: '+91 98765 43210',
    region: 'India',
  };
}

function download(
  id: string,
  name: string,
  company: string,
  region: string,
  downloads: number
): DataEntity {
  return {
    ...entity(
      id,
      name,
      'Verified brochure access from lead capture workflow.',
      'Active',
      'System',
      'Download'
    ),
    company,
    region,
    downloads,
  };
}

function request(
  id: string,
  name: string,
  company: string,
  description: string,
  status: DataEntity['status']
): DataEntity {
  return {
    ...entity(id, name, description, status, 'Sales Engineering', 'Request'),
    company,
    email: 'engineering@example.com',
    phone: '+91 98765 43210',
  };
}

function user(
  id: string,
  name: string,
  email: string,
  role: string,
  status: DataEntity['status']
): DataEntity {
  return {
    ...entity(id, name, `${role} with controlled admin access.`, status, 'Super Admin', 'User'),
    email,
    role,
  };
}

function role(id: string, name: string, description: string): DataEntity {
  return entity(id, name, description, 'Active', 'Super Admin', 'Role');
}

function log(id: string, name: string, description: string): DataEntity {
  return entity(id, name, description, 'Active', 'System', 'Audit');
}
