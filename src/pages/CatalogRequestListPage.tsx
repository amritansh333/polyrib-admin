import React from 'react';
import { Edit3, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import Toolbar from '../components/Toolbar';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Pagination from '../components/Pagination';
import useResourceCollection from '../hooks/useResourceCollection';

export default function CatalogRequestListPage() {
  const navigate = useNavigate();
  const collection = useResourceCollection('catalogrequests');

  return (
    <>
      <PageHeader
        eyebrow="Sales Requests"
        title="Catalog Requests"
        description="Review catalog requests submitted through the public website."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/catalogrequests', label: 'Catalog Requests' },
        ]}
        action={
          <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
            <RefreshCw />
            {collection.loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        }
        meta={
          <>
            <StatusBadge tone="blue">{collection.total} records</StatusBadge>
            <StatusBadge tone="green">API Repository</StatusBadge>
          </>
        }
      />

      <PageContainer className="space-y-6">
        <Toolbar>
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
            <SearchBar
              value={collection.query}
              onChange={(event) => collection.setQuery(event.target.value)}
              placeholder="Search catalog requests..."
            />
          </div>
          <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
            <RefreshCw />
            Refresh
          </Button>
        </Toolbar>

        {collection.loading && (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        )}

        {collection.error && !collection.loading && (
          <EmptyState title="Unable to load catalog requests" description={collection.error} />
        )}

        {!collection.loading && !collection.error && collection.rows.length === 0 && (
          <EmptyState
            title="No catalog requests found"
            description="Try clearing the search or refresh to load recent submissions."
          />
        )}

        {!collection.loading && !collection.error && collection.rows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-divider bg-surface-raised shadow-sm">
            <table className="min-w-full border-collapse text-left">
              <thead className="border-b border-divider bg-surface-subtle">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Catalog
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Date
                  </th>
                  <th className="w-32 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider bg-white">
                {collection.rows.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-subtle">
                    <td className="max-w-[18rem] px-4 py-3 text-sm text-charcoal">
                      {row.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal-light">{row.phone || '—'}</td>
                    <td className="max-w-[18rem] px-4 py-3 text-sm text-charcoal-light truncate">
                      {row.email || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal-light truncate">
                      {(row as any).catalog_name || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal-light">
                      {formatDate(row.createdAt || (row as any).created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <ActionMenu
                        items={[
                          {
                            label: 'View',
                            icon: <Eye className="h-4 w-4" />,
                            onSelect: () => navigate(`/catalogrequests/${row.id}`),
                          },
                          {
                            label: 'Edit',
                            icon: <Edit3 className="h-4 w-4" />,
                            onSelect: () => navigate(`/catalogrequests/${row.id}/edit`),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!collection.loading && !collection.error && collection.rows.length > 0 && (
          <Pagination
            page={collection.page}
            totalPages={collection.totalPages}
            onPageChange={collection.setPage}
          />
        )}
      </PageContainer>
    </>
  );
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
