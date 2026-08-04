import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ResourceListPage from '../pages/ResourceListPage';
import ResourceDetailPage from '../pages/ResourceDetailPage';
import ResourceFormPage from '../pages/ResourceFormPage';
import { resources } from '../services/mockData';
import type { ResourceConfig } from '../types/admin';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="/dashboard" element={withAdmin(<HomePage />)} />
      {resources.flatMap((config) => resourceRoutes(config))}

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function resourceRoutes(config: ResourceConfig) {
  const createPaths = [
    ...new Set(
      [config.createPath, `${config.basePath}/new`].filter((path): path is string => Boolean(path))
    ),
  ];

  return [
    <Route
      key={config.basePath}
      path={config.basePath}
      element={withAdmin(<ResourceListPage config={config} />)}
    />,
    ...createPaths.map((path) => (
      <Route
        key={path}
        path={path}
        element={withAdmin(<ResourceFormPage config={config} mode="create" />)}
      />
    )),
    <Route
      key={`${config.basePath}/:id`}
      path={`${config.basePath}/:id`}
      element={withAdmin(<ResourceDetailPage config={config} />)}
    />,
    <Route
      key={`${config.basePath}/:id/edit`}
      path={`${config.basePath}/:id/edit`}
      element={withAdmin(<ResourceFormPage config={config} mode="edit" />)}
    />,
  ];
}

function withAdmin(children: React.ReactNode) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
