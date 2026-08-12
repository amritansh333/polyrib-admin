import React from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import Toolbar from '../components/Toolbar';
import SearchBar from '../components/SearchBar';
import Select from '../components/Select';
import Button from '../components/Button';
import ResourceTable, { type ResourceTableColumn } from '../components/ResourceTable';
import ActionMenu from '../components/ActionMenu';
import StatusBadge from '../components/StatusBadge';
import useResourceCollection from '../hooks/useResourceCollection';
import type { DataEntity } from '../types/admin';

function getLeadName(row: DataEntity) {
  const firstName = row.firstName?.trim();
  const lastName = row.lastName?.trim();
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : '-';
}

function getLeadText(value?: string | null) {
  return value?.trim() ? value.trim() : '-';
}

function getLeadDownloadCount(row: DataEntity) {
  return typeof row.downloadCount === 'number' ? String(row.downloadCount) : '0';
}

function formatLeadDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatLeadStatus(value?: string) {
  if (!value) return '-';
  return value.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
}

function statusTone(status?: string) {
  if (!status) return 'neutral';
  const normalized = status.toLowerCase();
  if (
    normalized === 'published' ||
    normalized === 'active' ||
    normalized === 'closed' ||
    normalized === 'resolved' ||
    normalized === 'download_authorized'
  ) {
    return 'green';
  }
  if (
    normalized === 'review' ||
    normalized === 'pending' ||
    normalized === 'draft' ||
    normalized === 'in progress'
  ) {
    return 'amber';
  }
  if (normalized === 'archived') return 'neutral';
  return 'blue';
}

function getLeadId(row: DataEntity) {
  return (row as DataEntity & { _id?: string })._id ?? row.id;
}

export default function LeadListPage() {
  const navigate = useNavigate();
  const collection = useResourceCollection('leads');

  const columns: ResourceTableColumn<DataEntity>[] = [
    {
      key: 'firstName',
      header: 'Name',
      sortable: true,
      className: 'min-w-[170px] max-w-[220px] whitespace-nowrap',
      render: (row) => {
        const value = getLeadName(row);
        return (
          <div className="max-w-[220px] truncate" title={value}>
            <span className="font-medium text-charcoal">{value}</span>
          </div>
        );
      },
    },
    {
      key: 'companyName',
      header: 'Company Name',
      sortable: true,
      className: 'min-w-[170px] max-w-[220px] whitespace-nowrap',
      render: (row) => {
        const value = getLeadText(row.companyName);
        return (
          <div className="max-w-[220px] truncate" title={value}>
            <span className="text-charcoal">{value}</span>
          </div>
        );
      },
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      className: 'min-w-[220px] max-w-[260px] whitespace-nowrap',
      render: (row) => {
        const value = getLeadText(row.email);
        return (
          <div className="max-w-[260px] truncate" title={value}>
            <span className="text-charcoal">{value}</span>
          </div>
        );
      },
    },
    {
      key: 'mobileNumber',
      header: 'Mobile Number',
      sortable: true,
      className: 'min-w-[150px] max-w-[180px] whitespace-nowrap',
      render: (row) => {
        const value = getLeadText(row.mobileNumber);
        return (
          <div className="max-w-[180px] truncate" title={value}>
            <span className="text-charcoal">{value}</span>
          </div>
        );
      },
    },
    {
      key: 'downloadCount',
      header: 'Download Count',
      sortable: true,
      className: 'w-[120px] whitespace-nowrap',
      render: (row) => {
        const value = getLeadDownloadCount(row);
        return <span className="font-medium text-charcoal">{value}</span>;
      },
    },
    {
      key: 'productName',
      header: 'Product',
      sortable: true,
      className: 'min-w-[180px] max-w-[240px] whitespace-nowrap',
      render: (row) => {
        const value = getLeadText(row.productName);
        return (
          <div className="max-w-[240px] truncate" title={value}>
            <span className="text-charcoal">{value}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      className: 'min-w-[140px] whitespace-nowrap',
      render: (row) => {
        const value = formatLeadStatus(row.status);
        return <StatusBadge tone={statusTone(row.status)}>{value}</StatusBadge>;
      },
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      className: 'min-w-[140px] whitespace-nowrap',
      render: (row) => {
        const value = formatLeadDate(row.createdAt);
        return <span className="text-charcoal">{value}</span>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Lead Intelligence"
        title="Leads"
        description="Track verified document access and product interest signals."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/leads', label: 'Leads' },
        ]}
        action={
          <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
            Refresh
          </Button>
        }
        meta={<StatusBadge tone="blue">{collection.total} records</StatusBadge>}
      />

      <PageContainer className="space-y-6">
        <Toolbar>
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
            <SearchBar
              value={collection.query}
              onChange={(e) => collection.setQuery(e.target.value)}
              placeholder="Search downloads..."
            />
            <Select
              value={collection.status}
              onChange={(e) => collection.setStatus(e.target.value)}
              options={[
                { label: 'All leads', value: 'all' },
                { label: 'Active', value: 'Active' },
              ]}
              aria-label="Leads filter"
            />
          </div>
          <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
            Refresh
          </Button>
        </Toolbar>

        <ResourceTable
          rows={collection.rows}
          columns={columns}
          loading={collection.loading}
          error={collection.error}
          page={collection.page}
          totalPages={collection.totalPages}
          sortKey={String(collection.sortKey)}
          sortDirection={collection.sortDirection}
          onPageChange={collection.setPage}
          onSortChange={(key) => collection.setSort(key as keyof DataEntity)}
          onView={(row) => navigate(`/leads/${getLeadId(row)}`)}
          desktopContainerClassName="overflow-x-auto"
          desktopTableClassName="min-w-[1120px]"
          renderRowActions={(row) => (
            <div className="flex justify-end">
              <ActionMenu
                items={[
                  {
                    label: 'View',
                    icon: <Eye className="h-4 w-4" />,
                    onSelect: () => navigate(`/leads/${getLeadId(row)}`),
                  },
                ]}
              />
            </div>
          )}
        />
      </PageContainer>
    </>
  );
}
