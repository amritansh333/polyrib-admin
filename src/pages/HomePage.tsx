import React from 'react';
import {
  Activity,
  Archive,
  CheckCircle2,
  ClipboardList,
  Database,
  Download,
  FileDown,
  FileText,
  HardDrive,
  Layers,
  Package,
  PackagePlus,
  PenTool,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import StatCard from '../components/StatCard';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import ResourceTable, { type ResourceTableColumn } from '../components/ResourceTable';
import ActivityItem from '../components/ActivityItem';
import QuickActionCard from '../components/QuickActionCard';
import MetricCard from '../components/MetricCard';
import Timeline from '../components/Timeline';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Select from '../components/Select';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../providers/ToastProvider';
import { resources } from '../services/mockData';
import { downloadCsv } from '../utils/csv';
import { useRepository } from '../repositories/RepositoryProvider';
import type { DataEntity, ResourceConfig } from '../types/admin';
import useDashboardData from '../hooks/useDashboardData';

const kpiPaths = [
  '/products',
  '/categories',
  '/subcategories',
  '/brands',
  '/materials',
  '/industries',
  '/leads',
  '/enquiries',
  '/drawing-requests',
  '/blog',
  '/media-library',
  '/users',
  '/roles',
];

export default function HomePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const [query, setQuery] = React.useState('');
  const [division, setDivision] = React.useState('all');
  const [period, setPeriod] = React.useState('today');
  const [status, setStatus] = React.useState('all');
  const { loading, counts, products, leads, downloads, materials } = useDashboardData({
    division,
    period,
    query,
    status,
  });

  const kpis = React.useMemo(() => {
    const baseKpis = kpiPaths
      .map((path) => resources.find((resource) => resource.basePath === path))
      .filter((resource): resource is ResourceConfig => Boolean(resource))
      .map((resource) => ({
        label: resource.title,
        value: String(counts[resource.key] ?? 0),
        detail: `${resource.eyebrow} records`,
        icon: <resource.icon className="h-5 w-5" />,
        to: resource.basePath,
        tone: ['leads', 'users'].includes(resource.key) ? ('green' as const) : ('blue' as const),
      }));

    const catalogRequestsCard = {
      label: 'Catalog Requests',
      value: String(counts.catalogrequests ?? counts['catalogrequests'] ?? 0),
      detail: 'Sales requests',
      icon: <FileText className="h-5 w-5" />,
      to: '/catalogrequests',
      tone: 'blue' as const,
    };

    const insertIndex = baseKpis.findIndex((item) => item.to === '/drawing-requests');
    if (insertIndex >= 0) {
      return [
        ...baseKpis.slice(0, insertIndex + 1),
        catalogRequestsCard,
        ...baseKpis.slice(insertIndex + 1),
      ];
    }

    return [...baseKpis, catalogRequestsCard];
  }, [counts]);

  const combinedRows = [...products, ...leads, ...downloads, ...materials];

  return (
    <>
      <PageHeader
        eyebrow="Executive Dashboard"
        title="Khanna Polyrib Admin"
        description="Internal manufacturing CMS for catalog operations, technical downloads, sales requests, content governance, and system visibility."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/dashboard', label: 'Dashboard' },
        ]}
        action={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                downloadCsv('dashboard-snapshot.csv', combinedRows);
                toast.push('Dashboard snapshot exported.', 'success');
              }}
            >
              <Download />
              Export Snapshot
            </Button>
            <Button type="button" onClick={() => navigate('/products/new')}>
              <PackagePlus />
              New Product Draft
            </Button>
          </>
        }
        meta={
          <>
            <StatusBadge tone="green">Website Live</StatusBadge>
            <StatusBadge tone={repository.source === 'api' ? 'green' : 'blue'}>
              {repository.source === 'api' ? 'API Repository' : 'Mock Repository'}
            </StatusBadge>
            <StatusBadge tone="neutral">Updated 2026-08-04</StatusBadge>
          </>
        }
      />

      <PageContainer className="space-y-8">
        <FilterBar className="grid-cols-1 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
          <SearchBar
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dashboard records..."
          />
          <Select
            aria-label="Division"
            value={division}
            onChange={(event) => setDivision(event.target.value)}
            options={[{ label: 'All divisions', value: 'all' }]}
          />
          <Select
            aria-label="Period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            options={[
              { label: 'Today', value: 'today' },
              { label: '7 days', value: '7d' },
              { label: '30 days', value: '30d' },
            ]}
          />
          <Select
            aria-label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { label: 'All status', value: 'all' },
              { label: 'Needs review', value: 'review' },
              { label: 'Published', value: 'published' },
            ]}
          />
        </FilterBar>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <StatCard
              key={item.to}
              label={item.label}
              value={item.value}
              detail={item.detail}
              icon={item.icon}
              tone={item.tone}
              trend="up"
              onClick={() => navigate(item.to)}
            />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <DashboardCard
            title="Recent Activity"
            description="Content, lead, and media movement across the CMS."
            className="xl:col-span-1"
          >
            <ActivityItem
              title={products[0]?.name ?? 'Catalog record refreshed'}
              description={
                products[0]?.description ??
                (repository.source === 'api'
                  ? 'Product data is loaded from the backend API.'
                  : 'Product data is loaded from the mock repository.')
              }
              time="Today"
              icon={<Package className="h-4 w-4" />}
              status="Catalog"
            />
            <ActivityItem
              title={leads[0]?.company ?? leads[0]?.name ?? 'Lead queue reviewed'}
              description={
                leads[0]?.description ??
                (repository.source === 'api'
                  ? 'Commercial records are available from the backend API.'
                  : 'Commercial records are available for review.')
              }
              time="Today"
              icon={<ClipboardList className="h-4 w-4" />}
              status="Leads"
            />
            <ActivityItem
              title={downloads[0]?.name ?? 'Download record available'}
              description={
                downloads[0]?.description ??
                (repository.source === 'api'
                  ? 'Brochure activity is ready for export from the backend API.'
                  : 'Brochure activity is ready for export.')
              }
              time="Today"
              icon={<Archive className="h-4 w-4" />}
              status="Media"
            />
          </DashboardCard>

          <DashboardCard
            title="Recent Leads"
            description="Incoming commercial requests requiring review."
            action={
              <Button size="xs" variant="outline" onClick={() => navigate('/leads')}>
                View all
              </Button>
            }
            className="xl:col-span-2"
          >
            <ResourceTable
              rows={leads}
              columns={leadColumns}
              loading={loading}
              pageSize={4}
              onView={(row) => navigate(`/leads/${row.id}`)}
              onEdit={(row) => navigate(`/leads/${row.id}/edit`)}
            />
          </DashboardCard>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DashboardCard
            title="Recent Downloads"
            description="Brochure access from verified leads."
          >
            <ResourceTable
              rows={downloads}
              columns={downloadColumns}
              loading={loading}
              pageSize={4}
              onView={(row) => navigate(`/leads/${row.id}`)}
              onEdit={(row) => navigate(`/leads/${row.id}/edit`)}
            />
          </DashboardCard>

          <DashboardCard title="Latest Products" description="Newest catalog records and drafts.">
            <ResourceTable
              rows={products}
              columns={productColumns}
              loading={loading}
              pageSize={4}
              onView={(row) => navigate(`/products/${row.id}`)}
              onEdit={(row) => navigate(`/products/${row.id}/edit`)}
            />
          </DashboardCard>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <DashboardCard title="Popular Materials" description="Most viewed material families.">
            <div className="grid gap-3">
              {materials.map((material) => (
                <MetricCard
                  key={material.id}
                  title={material.material ?? material.category ?? 'Material'}
                  value={material.name}
                  description={material.description}
                  icon={<Layers className="h-4 w-4" />}
                />
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Storage Usage" className="xl:col-span-1">
            <StorageUsage assetCount={counts['media-library'] ?? 0} />
          </DashboardCard>

          <DashboardCard title="Quick Actions" description="Common internal admin workflows.">
            <div className="grid gap-3">
              <QuickActionCard
                title="Create product draft"
                description="Prepare a catalog record for engineering review."
                icon={<PackagePlus className="h-4 w-4" />}
                onClick={() => navigate('/products/new')}
              />
              <QuickActionCard
                title="Upload brochure"
                description="Add a verified PDF to the media library."
                icon={<FileDown className="h-4 w-4" />}
                onClick={() => navigate('/media-library/upload')}
              />
              <QuickActionCard
                title="Review enquiries"
                description="Triage pending customer enquiries."
                icon={<ClipboardList className="h-4 w-4" />}
                onClick={() => navigate('/enquiries')}
              />
            </div>
          </DashboardCard>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <DashboardCard
            title="System Status"
            description="Operational health across local admin modules."
          >
            <StatusRow
              label="Website Status"
              status="Live"
              detail="Public site status indicator is available"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
            <StatusRow
              label="Admin Bundle"
              status="Healthy"
              detail="React runtime and routing are active"
              icon={<Activity className="h-4 w-4" />}
            />
            <StatusRow
              label="Mock Repository"
              status="Ready"
              detail="Local CRUD, filtering, sorting, and exports are enabled"
              icon={<Database className="h-4 w-4" />}
            />
          </DashboardCard>

          <DashboardCard title="Publishing Timeline" description="Recent governance events.">
            <Timeline
              items={products.slice(0, 3).map((product) => ({
                title: product.name,
                description: product.description,
                time: product.updatedAt,
                tone:
                  product.status === 'Published'
                    ? 'green'
                    : product.status === 'Review'
                      ? 'amber'
                      : undefined,
              }))}
            />
          </DashboardCard>

          <DashboardCard
            title="Foundation Preview"
            description="Reusable loading and empty states."
          >
            {loading ? (
              <div className="grid gap-3">
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-4 w-3/4" />
                <LoadingSkeleton className="h-20 w-full" />
              </div>
            ) : (
              <EmptyState
                title="No escalation alerts"
                description={
                  repository.source === 'api'
                    ? 'Critical website, admin, and backend repository checks are currently clear.'
                    : 'Critical website, admin, and mock repository checks are currently clear.'
                }
                icon={<ShieldCheck className="h-5 w-5" />}
              />
            )}
          </DashboardCard>
        </section>
      </PageContainer>
    </>
  );
}

const leadColumns: ResourceTableColumn<DataEntity>[] = [
  {
    key: 'company',
    header: 'Company',
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-semibold text-charcoal">{row.company ?? row.name}</p>
        <p className="text-xs text-muted-foreground">{row.email}</p>
      </div>
    ),
  },
  { key: 'description', header: 'Interest', sortable: true, render: (row) => row.description },
  { key: 'source', header: 'Source', sortable: true, render: (row) => row.source ?? row.owner },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => <StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge>,
  },
];

const downloadColumns: ResourceTableColumn<DataEntity>[] = [
  {
    key: 'name',
    header: 'Brochure',
    sortable: true,
    render: (row) => <span className="font-semibold text-charcoal">{row.name}</span>,
  },
  { key: 'company', header: 'Company', sortable: true, render: (row) => row.company ?? row.owner },
  { key: 'region', header: 'Region', sortable: true, render: (row) => row.region ?? 'India' },
  { key: 'downloads', header: 'Downloads', sortable: true, render: (row) => row.downloads ?? 0 },
];

const productColumns: ResourceTableColumn<DataEntity>[] = [
  {
    key: 'name',
    header: 'Product',
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-semibold text-charcoal">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.id}</p>
      </div>
    ),
  },
  { key: 'category', header: 'Family', sortable: true, render: (row) => row.category ?? 'Catalog' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => <StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge>,
  },
  { key: 'updatedAt', header: 'Updated', sortable: true, render: (row) => row.updatedAt },
];

function StorageUsage({ assetCount }: { assetCount: number }) {
  const used = Math.min(82, 28 + assetCount * 6);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-label">Storage Usage</p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-charcoal">{used}% allocated</h3>
        </div>
        <HardDrive className="h-8 w-8 text-primary" />
      </div>
      <div className="mt-5 h-2 border border-primary/20 bg-primary/10">
        <div className="h-full bg-primary" style={{ width: `${used}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <span className="border border-divider bg-surface-subtle px-2 py-1 text-charcoal-light">
          Assets {assetCount}
        </span>
        <span className="border border-divider bg-surface-subtle px-2 py-1 text-charcoal-light">
          PDFs Active
        </span>
        <span className="border border-divider bg-surface-subtle px-2 py-1 text-charcoal-light">
          Images Active
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

function statusTone(status: DataEntity['status']) {
  if (status === 'Published' || status === 'Active' || status === 'Closed') return 'green';
  if (status === 'Review' || status === 'Pending' || status === 'Draft') return 'amber';
  return 'neutral';
}
