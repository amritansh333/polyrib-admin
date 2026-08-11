import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import Toolbar from '../components/Toolbar';
import SearchBar from '../components/SearchBar';
import Select from '../components/Select';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ResourceTable, { type ResourceTableColumn } from '../components/ResourceTable';
import ActionMenu from '../components/ActionMenu';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useToast } from '../providers/ToastProvider';
import {
  AdminBlogListItem,
  listAdminBlogs,
  listAdminBlogCategories,
  deleteAdminBlog,
  publishAdminBlog,
  unpublishAdminBlog,
  duplicateAdminBlog,
} from '../lib/adminBlogApi';
import { resolveBlogImageUrl } from '../lib/assetUrl';

const sortOptions = [
  { label: 'Newest', value: 'publishedAt:desc' },
  { label: 'Oldest', value: 'publishedAt:asc' },
  { label: 'Recently updated', value: 'updatedAt:desc' },
  { label: 'Title A-Z', value: 'title:asc' },
  { label: 'Title Z-A', value: 'title:desc' },
];

const typeOptions = [
  { label: 'All types', value: 'all' },
  { label: 'Blog', value: 'Blog' },
  { label: 'Gallery', value: 'Gallery' },
];

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
];

function formatDate(value: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getStatusLabel(status?: string) {
  return String(status ?? 'Draft').toUpperCase();
}

function BlogListImage({ src, alt }: { src?: string | null; alt: string }) {
  const imageUrl = src ? resolveBlogImageUrl(src) : undefined;

  return <img src={imageUrl} alt={alt} className="h-14 w-24 rounded object-cover" loading="lazy" />;
}

export default function BlogListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [blogs, setBlogs] = React.useState<AdminBlogListItem[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [category, setCategory] = React.useState('all');
  const [sort, setSort] = React.useState('publishedAt:desc');
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryFilter = category !== 'all' ? category : undefined;
      const typeFilter = type !== 'all' ? type : undefined;
      const statusFilter = status !== 'all' ? status : undefined;
      const response = await listAdminBlogs({
        query: query.trim() || undefined,
        type: typeFilter,
        status: statusFilter,
        category: categoryFilter,
        sort,
        page,
        limit: pageSize,
      });
      setBlogs(response.items);
      setTotalPages(response.meta.pages);
      setError(null);
    } catch {
      setError('Unable to load blog posts. Retry the operation.');
      setBlogs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [category, page, pageSize, query, sort, status, type]);

  const loadCategories = React.useCallback(async () => {
    try {
      const result = await listAdminBlogCategories();
      setCategories(result);
    } catch {
      setCategories([]);
    }
  }, []);

  React.useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleAction = async (action: () => Promise<unknown>, message: string) => {
    setActionLoading(true);
    try {
      await action();
      toast.push(message, 'success');
      await refresh();
    } catch {
      toast.push('Action failed. Retry from the current page.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const columns: ResourceTableColumn<AdminBlogListItem>[] = [
    {
      key: 'image',
      header: 'Featured',
      sortable: false,
      render: (row) => <BlogListImage src={row.image} alt={row.title} />,
      className: 'w-[120px]',
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-charcoal">{row.title}</p>
          <p className="text-xs text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (row) => row.type,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row) => row.category || '-',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => {
        const isPublished = String(row.status ?? '').toLowerCase() === 'published';
        return (
          <StatusBadge tone={isPublished ? 'green' : 'amber'}>
            {getStatusLabel(row.status)}
          </StatusBadge>
        );
      },
    },
    {
      key: 'publishedAt',
      header: 'Published',
      sortable: true,
      render: (row) =>
        String(row.status ?? '').toLowerCase() === 'published' && row.publishedAt
          ? formatDate(row.publishedAt)
          : '-',
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortable: true,
      render: (row) => formatDate(row.updatedAt),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Website Content"
        title="Blog & Gallery"
        description="Manage blog posts, gallery articles, publication state, and media assets."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/blog', label: 'Blog & Gallery' },
        ]}
        action={
          <Button type="button" onClick={() => navigate('/blog/new')}>
            <Plus />
            New Post
          </Button>
        }
        meta={
          <>
            <StatusBadge tone="blue">{blogs.length} posts</StatusBadge>
            <StatusBadge tone="green">Admin API</StatusBadge>
          </>
        }
      />

      <PageContainer className="space-y-6">
        <Toolbar>
          <div className="grid min-w-0 flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_200px] xl:grid-cols-[minmax(0,1fr)_200px_200px]">
            <SearchBar
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search title, slug, excerpt, tags..."
            />
            <Select
              value={type}
              onChange={(event) => {
                setType(event.target.value);
                setPage(1);
              }}
              options={typeOptions}
            />
            <Select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              options={statusOptions}
            />
            <Select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              options={[
                { label: 'All categories', value: 'all' },
                ...categories.map((item) => ({ label: item, value: item })),
              ]}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              options={sortOptions}
            />
            <Button type="button" variant="outline" onClick={() => void refresh()}>
              <RefreshCw />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </Toolbar>

        {loading ? (
          <LoadingSkeleton className="h-96 w-full" />
        ) : error ? (
          <EmptyState title="Unable to load posts" description={error} />
        ) : blogs.length === 0 ? (
          <EmptyState
            title="No blog posts found"
            description="Try adjusting the search or filters to find matching posts."
          />
        ) : (
          <ResourceTable
            rows={blogs}
            columns={columns}
            loading={loading}
            error={error}
            page={page}
            totalPages={totalPages}
            sortKey={sort.split(':')[0]}
            sortDirection={(sort.split(':')[1] as 'asc' | 'desc') ?? 'desc'}
            onPageChange={(nextPage) => setPage(nextPage)}
            onSortChange={(key) => {
              const [currentField, currentDirection] = sort.split(':');
              const newDirection =
                currentField === key && currentDirection === 'asc' ? 'desc' : 'asc';
              setSort(`${key}:${newDirection}`);
            }}
            onView={(row) => navigate(`/blog/${row.id}`)}
            onEdit={(row) => navigate(`/blog/${row.id}/edit`)}
            onDelete={(ids) => setDeleteId(ids[0] ?? null)}
            onDuplicate={(row) =>
              void handleAction(() => duplicateAdminBlog(row.id), 'Post duplicated.')
            }
            renderRowActions={(row) => (
              <ActionMenu
                items={[
                  {
                    label: 'View details',
                    onSelect: () => navigate(`/blog/${row.id}`),
                  },
                  {
                    label: 'Edit',
                    onSelect: () => navigate(`/blog/${row.id}/edit`),
                  },
                  String(row.status ?? '').toLowerCase() === 'published'
                    ? {
                        label: 'Unpublish',
                        danger: true,
                        onSelect: () =>
                          void handleAction(() => unpublishAdminBlog(row.id), 'Post unpublished.'),
                      }
                    : {
                        label: 'Publish',
                        onSelect: () =>
                          void handleAction(() => publishAdminBlog(row.id), 'Post published.'),
                      },
                  {
                    label: 'Duplicate',
                    onSelect: () =>
                      void handleAction(() => duplicateAdminBlog(row.id), 'Post duplicated.'),
                  },
                  {
                    label: 'Delete',
                    danger: true,
                    onSelect: () => setDeleteId(row.id),
                  },
                ]}
              />
            )}
          />
        )}
      </PageContainer>

      <ConfirmationDialog
        open={Boolean(deleteId)}
        title="Delete blog post"
        description="This action cannot be undone. Are you sure you want to delete this blog post?"
        confirmLabel={actionLoading ? 'Deleting...' : 'Delete'}
        danger
        onClose={() => setDeleteId(null)}
        onConfirm={() =>
          void handleAction(async () => {
            if (!deleteId) return;
            await deleteAdminBlog(deleteId);
          }, 'Blog post deleted.').then(() => setDeleteId(null))
        }
      />
    </>
  );
}
