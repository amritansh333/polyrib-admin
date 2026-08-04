import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

export default function PermissionGuard({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const { hasPermission } = usePermissions();
  const allowed = hasPermission(permission);
  if (!allowed) return <div className="p-6">Unauthorized</div>;
  return <>{children}</>;
}
