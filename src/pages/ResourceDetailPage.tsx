import { Edit, Mail, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useResourceItem from '../hooks/useResourceItem';
import type { DataEntity, ResourceConfig } from '../types/admin';

export default function ResourceDetailPage({ config }: { config: ResourceConfig }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem(config.key, id);

  return (
    <>
      <PageHeader
        eyebrow={config.eyebrow}
        title={item?.name ?? config.title}
        description={item?.description ?? config.description}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: config.basePath, label: config.title },
          { to: `${config.basePath}/${id}`, label: id ?? 'Record' },
        ]}
        action={
          item && (
            <Button type="button" onClick={() => navigate(`${config.basePath}/${item.id}/edit`)}>
              <Edit />
              Edit
            </Button>
          )
        }
        meta={item && <StatusBadge tone={statusTone(item.status)}>{item.status}</StatusBadge>}
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load record" description={error} />}
        {!loading && !item && (
          <EmptyState
            title="Record not found"
            description="The requested CMS record is unavailable."
          />
        )}
        {item && (
          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardCard title="Overview" className="xl:col-span-2">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
                {detailRows(item).map(([label, value]) => (
                  <div key={label} className="bg-surface-raised p-4">
                    <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-charcoal">
                      {value || 'Not assigned'}
                    </dd>
                  </div>
                ))}
              </dl>
            </DashboardCard>
            <DashboardCard title="Contact & Ownership">
              <div className="space-y-4">
                <div>
                  <p className="section-label">Owner</p>
                  <p className="mt-1 font-semibold text-charcoal">{item.owner}</p>
                </div>
                {item.email && (
                  <div className="flex items-center gap-2 text-sm text-charcoal-light">
                    <Mail className="h-4 w-4 text-primary" />
                    {item.email}
                  </div>
                )}
                {item.phone && (
                  <div className="flex items-center gap-2 text-sm text-charcoal-light">
                    <Phone className="h-4 w-4 text-primary" />
                    {item.phone}
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
        )}
      </PageContainer>
    </>
  );
}

function detailRows(item: DataEntity): [string, string | number | undefined][] {
  return [
    ['ID', item.id],
    ['Status', item.status],
    ['Category', item.category],
    ['Brand', item.brand],
    ['Material', item.material],
    ['Company', item.company],
    ['Region', item.region],
    ['Downloads', item.downloads],
    ['Created', item.createdAt],
    ['Updated', item.updatedAt],
  ];
}

function statusTone(status: DataEntity['status']) {
  if (status === 'Published' || status === 'Active' || status === 'Closed') return 'green';
  if (status === 'Review' || status === 'Pending' || status === 'Draft') return 'amber';
  return 'neutral';
}
