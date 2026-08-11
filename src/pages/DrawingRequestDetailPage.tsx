import React from 'react';
import { ArrowUpRight, Download, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useResourceItem from '../hooks/useResourceItem';
import { resolveAdminAssetUrl } from '../lib/assetUrl';
import type { DataEntity, DrawingRequestFile } from '../types/admin';

export default function DrawingRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem('drawing-requests', id);

  return (
    <>
      <PageHeader
        eyebrow="Engineering Queue"
        title={item?.fullName ?? item?.name ?? 'Drawing Request'}
        description="Review a submitted drawing request with status, notes, and uploaded files."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/drawing-requests', label: 'Drawing Requests' },
          { to: `/drawing-requests/${id}`, label: id ?? 'Request' },
        ]}
        action={
          item ? (
            <Button type="button" onClick={() => navigate(`/drawing-requests/${item.id}/edit`)}>
              Edit status
            </Button>
          ) : null
        }
        meta={item && <StatusBadge tone={statusTone(item.status)}>{item.status}</StatusBadge>}
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load drawing request" description={error} />}
        {!loading && !error && !item && (
          <EmptyState
            title="Drawing request not found"
            description="The requested drawing request is unavailable."
          />
        )}
        {item && (
          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardCard title="Request details" className="xl:col-span-2">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
                <DetailRow label="Full Name" value={item.fullName || item.name || '—'} />
                <DetailRow label="Company" value={item.company || '—'} />
                <DetailRow label="Email" value={item.email || '—'} />
                <DetailRow label="Phone" value={item.phone || '—'} />
                <DetailRow
                  label="Status"
                  value={<StatusBadge tone={statusTone(item.status)}>{item.status}</StatusBadge>}
                />
                <DetailRow label="Created At" value={formatDate(item.createdAt)} />
                <DetailRow label="Updated At" value={formatDate(item.updatedAt)} />
                <DetailRow label="Files" value={String(item.files?.length ?? 0)} />
              </dl>
            </DashboardCard>

            <DashboardCard title="Notes">
              <p className="whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                {item.notes || 'No notes were submitted with this request.'}
              </p>
            </DashboardCard>

            <DashboardCard
              title="Uploaded files"
              description="Preview image uploads and open attachments from the backend storage."
            >
              {item.files && item.files.length > 0 ? (
                <div className="space-y-4">
                  {item.files.map((file) => (
                    <FileCard key={file.storedName} file={file} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-charcoal-light">
                  No uploaded files were attached to this request.
                </p>
              )}
            </DashboardCard>
          </div>
        )}
      </PageContainer>
    </>
  );
}

function FileCard({ file }: { file: DrawingRequestFile }) {
  const url = resolveAdminAssetUrl(file.relativePath);
  const isImage = file.mimeType?.startsWith('image/');

  return (
    <div className="overflow-hidden rounded-3xl border border-divider bg-surface-raised p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {isImage ? (
          <img
            src={url}
            alt={file.originalName}
            className="h-28 w-full max-w-[12rem] rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-28 w-full max-w-[12rem] items-center justify-center rounded-2xl border border-divider bg-surface-subtle text-muted-foreground">
            <FileText className="h-10 w-10" />
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm font-semibold text-charcoal">{file.originalName}</p>
            <p className="mt-1 text-xs text-charcoal-light">
              {file.mimeType || 'Unknown type'} · {file.extension || '—'} ·{' '}
              {formatFileSize(file.size)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-primary/60 hover:text-primary"
            >
              Open
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={url}
              download={file.originalName}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-charcoal bg-charcoal px-4 py-2 text-sm font-semibold text-white transition hover:bg-charcoal-dark"
            >
              Download
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-surface-raised p-4">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-charcoal">{value}</dd>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFileSize(size: number) {
  if (size === 0 || size === undefined) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let index = 0;
  let value = size;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(1).replace(/\.0$/, '')} ${units[index]}`;
}

function statusTone(status: DataEntity['status']) {
  if (status === 'COMPLETED' || status === 'Resolved' || status === 'Closed') return 'green';
  if (status === 'UNDER_REVIEW' || status === 'QUOTED' || status === 'In Progress') return 'amber';
  if (status === 'REJECTED' || status === 'Draft') return 'neutral';
  return 'blue';
}
