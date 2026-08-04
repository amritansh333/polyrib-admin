import React from 'react';
import {
  Activity,
  Archive,
  BookOpen,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Database,
  Download,
  FileDown,
  FileText,
  FolderTree,
  HardDrive,
  Image,
  Layers,
  Package,
  PackagePlus,
  PenTool,
  Settings,
  ShieldCheck,
  Tags,
  UserPlus,
  Users,
  Wrench,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import StatCard from '../components/StatCard';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import Table, { type TableColumn } from '../components/Table';
import ActivityItem from '../components/ActivityItem';
import QuickActionCard from '../components/QuickActionCard';
import MetricCard from '../components/MetricCard';
import Timeline from '../components/Timeline';
import ActionMenu from '../components/ActionMenu';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Select from '../components/Select';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

type Lead = {
  id: string;
  company: string;
  contact: string;
  interest: string;
  source: string;
  status: 'New' | 'Qualified' | 'Pending';
};

type DownloadRow = {
  id: string;
  brochure: string;
  company: string;
  region: string;
  time: string;
};

type ProductRow = {
  id: string;
  name: string;
  family: string;
  status: 'Published' | 'Draft' | 'Review';
  updated: string;
};

const overviewKpis = [
  {
    label: 'Total Products',
    value: '486',
    detail: '24 updated this month',
    icon: <Package className="h-5 w-5" />,
    trend: 'up' as const,
  },
  {
    label: 'Categories',
    value: '38',
    detail: 'Across two divisions',
    icon: <FolderTree className="h-5 w-5" />,
  },
  {
    label: 'Brands',
    value: '12',
    detail: 'POLYRIB, DIPRA, PCCLEAR',
    icon: <Tags className="h-5 w-5" />,
  },
  {
    label: 'Machine Components',
    value: '174',
    detail: 'RIPLA, CUTRITE, ARETE lines',
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    label: 'Semi Finished Products',
    value: '312',
    detail: 'Sheets, rods, tubes, rolls',
    icon: <Boxes className="h-5 w-5" />,
  },
  {
    label: 'Website Pages',
    value: '64',
    detail: 'All public pages indexed',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    label: 'Leads Today',
    value: '18',
    detail: '6 require review',
    icon: <Users className="h-5 w-5" />,
    trend: 'up' as const,
    tone: 'green' as const,
  },
  {
    label: 'Brochure Downloads',
    value: '142',
    detail: 'Last 24 hours',
    icon: <FileDown className="h-5 w-5" />,
    trend: 'up' as const,
  },
  {
    label: 'Drawing Requests',
    value: '11',
    detail: '4 awaiting engineering',
    icon: <PenTool className="h-5 w-5" />,
    tone: 'amber' as const,
  },
  {
    label: 'Pending Quotes',
    value: '27',
    detail: 'Oldest pending: 18 hours',
    icon: <ClipboardList className="h-5 w-5" />,
    tone: 'amber' as const,
  },
  {
    label: 'Active Users',
    value: '9',
    detail: '3 currently online',
    icon: <UserPlus className="h-5 w-5" />,
    tone: 'green' as const,
  },
  {
    label: 'Media Assets',
    value: '1,284',
    detail: 'Product images and documents',
    icon: <Image className="h-5 w-5" />,
  },
];

const recentLeads: Lead[] = [
  {
    id: 'L-1048',
    company: 'Apex Food Systems',
    contact: 'Neeraj Sharma',
    interest: 'RIPLA cutting boards',
    source: 'Quote form',
    status: 'New',
  },
  {
    id: 'L-1047',
    company: 'Bharat Cement Works',
    contact: 'Megha Rao',
    interest: 'ARETE silo liners',
    source: 'Brochure',
    status: 'Qualified',
  },
  {
    id: 'L-1046',
    company: 'Narmada Packaging',
    contact: 'Vikram Jain',
    interest: 'POLYRIB V wear strips',
    source: 'Material selector',
    status: 'Pending',
  },
];

const recentDownloads: DownloadRow[] = [
  {
    id: 'D-8071',
    brochure: 'Polyrib Master Product Catalogue',
    company: 'Mecpro Conveyors',
    region: 'Gujarat',
    time: '12 min ago',
  },
  {
    id: 'D-8070',
    brochure: 'PCCLEAR Sheets Catalogue',
    company: 'Skybuild Panels',
    region: 'Maharashtra',
    time: '34 min ago',
  },
  {
    id: 'D-8069',
    brochure: 'Arete Lining Materials Catalogue',
    company: 'Eastern Minerals',
    region: 'Odisha',
    time: '1 hr ago',
  },
];

const latestProducts: ProductRow[] = [
  {
    id: 'P-227',
    name: 'PLASCON-V Stress Relieved Rod',
    family: 'Rods & Tubes',
    status: 'Published',
    updated: 'Today',
  },
  {
    id: 'P-226',
    name: 'POLYRIB-HGX-266-EXT Glass Lined Sheet',
    family: 'Sheets & Blocks',
    status: 'Review',
    updated: 'Yesterday',
  },
  {
    id: 'P-225',
    name: 'CUTRITE Embossed LDPE Chopping Board',
    family: 'Machine Components',
    status: 'Draft',
    updated: '2 days ago',
  },
];

const popularMaterials = [
  { name: 'POLYRIB V', material: 'UHMW PE', usage: '42%', detail: 'Wear and slide components' },
  {
    name: 'PCCLEAR',
    material: 'Polycarbonate',
    usage: '21%',
    detail: 'Roofing and glazing sheets',
  },
  { name: 'KAYLON', material: 'Cast Nylon', usage: '16%', detail: 'Gears, bearings, wear pads' },
  {
    name: 'POLYRIB P',
    material: 'Polypropylene',
    usage: '12%',
    detail: 'Chemical tank fabrication',
  },
];

const brochureStats = [
  { name: 'Master Product Catalogue', downloads: '438', category: 'Corporate' },
  { name: 'Ripla Cutting Boards', downloads: '267', category: 'Machine Components' },
  { name: 'Arete Lining Materials', downloads: '219', category: 'Bulk Handling' },
];

const leadColumns: TableColumn<Lead>[] = [
  {
    key: 'company',
    header: 'Company',
    render: (row) => (
      <div>
        <p className="font-semibold text-charcoal">{row.company}</p>
        <p className="text-xs text-muted-foreground">{row.contact}</p>
      </div>
    ),
  },
  { key: 'interest', header: 'Interest', render: (row) => row.interest },
  { key: 'source', header: 'Source', render: (row) => row.source },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <StatusBadge
        tone={row.status === 'New' ? 'blue' : row.status === 'Qualified' ? 'green' : 'amber'}
      >
        {row.status}
      </StatusBadge>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: () => (
      <ActionMenu
        items={[
          { label: 'Assign lead', icon: <Users className="h-4 w-4" /> },
          { label: 'Create quote draft', icon: <FileText className="h-4 w-4" /> },
        ]}
      />
    ),
    className: 'w-12',
  },
];

const downloadColumns: TableColumn<DownloadRow>[] = [
  {
    key: 'brochure',
    header: 'Brochure',
    render: (row) => <span className="font-semibold text-charcoal">{row.brochure}</span>,
  },
  { key: 'company', header: 'Company', render: (row) => row.company },
  { key: 'region', header: 'Region', render: (row) => row.region },
  { key: 'time', header: 'Time', render: (row) => row.time },
];

const productColumns: TableColumn<ProductRow>[] = [
  {
    key: 'name',
    header: 'Product',
    render: (row) => (
      <div>
        <p className="font-semibold text-charcoal">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.id}</p>
      </div>
    ),
  },
  { key: 'family', header: 'Family', render: (row) => row.family },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <StatusBadge
        tone={row.status === 'Published' ? 'green' : row.status === 'Review' ? 'amber' : 'neutral'}
      >
        {row.status}
      </StatusBadge>
    ),
  },
  { key: 'updated', header: 'Updated', render: (row) => row.updated },
];

function StorageUsage() {
  const used = 68;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-label">Storage Usage</p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-charcoal">842 GB / 1.2 TB</h3>
        </div>
        <HardDrive className="h-8 w-8 text-primary" />
      </div>
      <div className="mt-5 h-2 border border-primary/20 bg-primary/10">
        <div className="h-full bg-primary" style={{ width: `${used}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <span className="border border-divider bg-surface-subtle px-2 py-1 text-charcoal-light">
          Images 412 GB
        </span>
        <span className="border border-divider bg-surface-subtle px-2 py-1 text-charcoal-light">
          PDFs 298 GB
        </span>
        <span className="border border-divider bg-surface-subtle px-2 py-1 text-charcoal-light">
          Drawings 132 GB
        </span>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  status,
  detail,
  icon,
}: {
  label: string;
  status: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-divider py-3 last:border-b-0">
      <div className="flex h-9 w-9 items-center justify-center bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-charcoal">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <StatusBadge tone="green">{status}</StatusBadge>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Executive Dashboard"
        title="Khanna Polyrib Admin"
        description="Internal manufacturing CMS foundation for catalog operations, technical downloads, sales requests, content governance, and system visibility."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/dashboard', label: 'Dashboard' },
        ]}
        action={
          <>
            <Button type="button" variant="outline">
              <Download />
              Export Snapshot
            </Button>
            <Button type="button">
              <PackagePlus />
              New Product Draft
            </Button>
          </>
        }
        meta={
          <>
            <StatusBadge tone="green">Website Live</StatusBadge>
            <StatusBadge tone="blue">Mock Data</StatusBadge>
            <StatusBadge tone="neutral">Last refreshed 09:42 IST</StatusBadge>
          </>
        }
      />

      <PageContainer className="space-y-8">
        <FilterBar className="grid-cols-1 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
          <SearchBar placeholder="Search dashboard records..." />
          <Select
            aria-label="Division"
            options={[
              { label: 'All divisions', value: 'all' },
              { label: 'Semi finished', value: 'semi' },
              { label: 'Machine components', value: 'machine' },
            ]}
          />
          <Select
            aria-label="Period"
            options={[
              { label: 'Today', value: 'today' },
              { label: '7 days', value: '7d' },
              { label: '30 days', value: '30d' },
            ]}
          />
          <Select
            aria-label="Status"
            options={[
              { label: 'All status', value: 'all' },
              { label: 'Needs review', value: 'review' },
              { label: 'Published', value: 'published' },
            ]}
          />
        </FilterBar>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewKpis.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <DashboardCard
            title="Recent Activity"
            description="Content, lead, and media movement across the CMS."
            className="xl:col-span-1"
          >
            <ActivityItem
              title="POLYRIB-H technical page updated"
              description="Thickness range and application copy revised for HDPE sheets."
              time="10 min ago"
              icon={<Package className="h-4 w-4" />}
              status="Catalog"
            />
            <ActivityItem
              title="Quote request assigned"
              description="Apex Food Systems moved to the sales engineering queue."
              time="25 min ago"
              icon={<ClipboardList className="h-4 w-4" />}
              status="Leads"
            />
            <ActivityItem
              title="New brochure asset uploaded"
              description="Arete Lining Materials Catalogue added to media library."
              time="1 hr ago"
              icon={<Archive className="h-4 w-4" />}
              status="Media"
            />
          </DashboardCard>

          <DashboardCard
            title="Recent Leads"
            description="Incoming commercial requests requiring review."
            action={
              <Button size="xs" variant="outline">
                View all
              </Button>
            }
            className="xl:col-span-2"
          >
            <Table columns={leadColumns} rows={recentLeads} rowKey={(row) => row.id} />
          </DashboardCard>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DashboardCard
            title="Recent Downloads"
            description="Brochure access from verified leads."
          >
            <Table columns={downloadColumns} rows={recentDownloads} rowKey={(row) => row.id} />
          </DashboardCard>

          <DashboardCard title="Latest Products" description="Newest catalog records and drafts.">
            <Table columns={productColumns} rows={latestProducts} rowKey={(row) => row.id} />
          </DashboardCard>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <DashboardCard title="Popular Materials" description="Most viewed material families.">
            <div className="grid gap-3">
              {popularMaterials.map((material) => (
                <MetricCard
                  key={material.name}
                  title={material.material}
                  value={material.name}
                  description={`${material.usage} of material page views. ${material.detail}.`}
                  icon={<Layers className="h-4 w-4" />}
                />
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Top Downloaded Brochures"
            description="High intent document activity."
          >
            <div className="space-y-3">
              {brochureStats.map((brochure) => (
                <div key={brochure.name} className="border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-charcoal">{brochure.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{brochure.category}</p>
                    </div>
                    <div className="font-heading text-2xl font-bold text-primary">
                      {brochure.downloads}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Quick Actions" description="Common internal admin workflows.">
            <div className="grid gap-3">
              <QuickActionCard
                title="Create product draft"
                description="Prepare a catalog record for engineering review."
                icon={<PackagePlus className="h-4 w-4" />}
              />
              <QuickActionCard
                title="Upload brochure"
                description="Add a verified PDF to the media library."
                icon={<FileDown className="h-4 w-4" />}
              />
              <QuickActionCard
                title="Review quote queue"
                description="Triage pending industrial enquiries."
                icon={<ClipboardList className="h-4 w-4" />}
              />
            </div>
          </DashboardCard>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <DashboardCard title="Storage Usage" className="xl:col-span-1">
            <StorageUsage />
          </DashboardCard>

          <DashboardCard title="System Status" description="Operational health across services.">
            <StatusRow
              label="Website Status"
              status="Live"
              detail="Public site responding normally"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
            <StatusRow
              label="Server Status"
              status="Healthy"
              detail="Node runtime and admin bundle stable"
              icon={<Activity className="h-4 w-4" />}
            />
            <StatusRow
              label="Database Status"
              status="Ready"
              detail="Connection layer reserved for backend integration"
              icon={<Database className="h-4 w-4" />}
            />
          </DashboardCard>

          <DashboardCard title="Publishing Timeline" description="Recent governance events.">
            <Timeline
              items={[
                {
                  title: 'Material selector copy approved',
                  description: 'Updated recommendation text for food processing use cases.',
                  time: 'Today',
                  tone: 'green',
                },
                {
                  title: 'Machine components imagery queued',
                  description: 'New CNC machined component photos awaiting approval.',
                  time: 'Yesterday',
                  tone: 'amber',
                },
                {
                  title: 'Permissions audit completed',
                  description: 'Editor role scope reviewed for catalog and content modules.',
                  time: 'Jul 31',
                },
              ]}
            />
          </DashboardCard>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardCard
            title="Foundation Preview"
            description="Reusable loading and empty states."
          >
            <div className="grid gap-3">
              <LoadingSkeleton className="h-4 w-full" />
              <LoadingSkeleton className="h-4 w-3/4" />
              <LoadingSkeleton className="h-20 w-full" />
            </div>
          </DashboardCard>
          <EmptyState
            title="No escalation alerts"
            description="Critical website, server, database, and storage checks are currently clear."
            icon={<ShieldCheck className="h-5 w-5" />}
          />
        </section>
      </PageContainer>
    </>
  );
}
