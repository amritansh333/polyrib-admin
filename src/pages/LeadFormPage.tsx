import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import useResourceItem from '../hooks/useResourceItem';

export default function LeadFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem('leads', id);

  return (
    <>
      <PageHeader
        eyebrow="Lead Intelligence"
        title={item?.name ?? 'Lead'}
        description="Leads are read-only in the admin. Edit operations are not available for this resource."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/leads', label: 'Leads' },
          { to: id ? `/leads/${id}/edit` : '/leads', label: id ? 'Edit' : 'New' },
        ]}
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load record" description={error} />}
        {!loading && !item && (
          <EmptyState title="Record not found" description="The selected lead is unavailable." />
        )}

        {item && (
          <div className="grid gap-6">
            <DashboardCard title="Lead (read-only)">
              <dl className="grid gap-3">
                <div>
                  <p className="section-label">Name</p>
                  <p className="mt-1 font-semibold text-charcoal">{item.name}</p>
                </div>
                <div>
                  <p className="section-label">Email</p>
                  <p className="mt-1 text-sm text-charcoal-light">{item.email}</p>
                </div>
                <div>
                  <p className="section-label">Company</p>
                  <p className="mt-1 text-sm text-charcoal-light">{item.company}</p>
                </div>
              </dl>
            </DashboardCard>
          </div>
        )}
      </PageContainer>
    </>
  );
}
