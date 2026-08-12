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
import EnquiryListPage from '../pages/EnquiryListPage';
import EnquiryDetailPage from '../pages/EnquiryDetailPage';
import EnquiryFormPage from '../pages/EnquiryFormPage';
import LeadListPage from '../pages/LeadListPage';
import LeadDetailPage from '../pages/LeadDetailPage';
import LeadFormPage from '../pages/LeadFormPage';
import MaterialListPage from '../pages/MaterialListPage';
import MaterialDetailPage from '../pages/MaterialDetailPage';
import MaterialFormPage from '../pages/MaterialFormPage';
import BlogListPage from '../pages/BlogListPage';
import BlogDetailPage from '../pages/BlogDetailPage';
import BlogFormPage from '../pages/BlogFormPage';
import IndustryListPage from '../pages/IndustryListPage';
import IndustryDetailPage from '../pages/IndustryDetailPage';
import IndustryFormPage from '../pages/IndustryFormPage';
import DrawingRequestListPage from '../pages/DrawingRequestListPage';
import DrawingRequestDetailPage from '../pages/DrawingRequestDetailPage';
import DrawingRequestFormPage from '../pages/DrawingRequestFormPage';
import CatalogRequestListPage from '../pages/CatalogRequestListPage';
import CatalogRequestDetailPage from '../pages/CatalogRequestDetailPage';
import CatalogRequestFormPage from '../pages/CatalogRequestFormPage';
import BrandListPage from '../pages/BrandListPage';
import BrandDetailPage from '../pages/BrandDetailPage';
import BrandFormPage from '../pages/BrandFormPage';
import CategoryListPage from '../pages/CategoryListPage';
import CategoryDetailPage from '../pages/CategoryDetailPage';
import CategoryFormPage from '../pages/CategoryFormPage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProductFormPage from '../pages/ProductFormPage';
import SubcategoryListPage from '../pages/SubcategoryListPage';
import SubcategoryDetailPage from '../pages/SubcategoryDetailPage';
import SubcategoryFormPage from '../pages/SubcategoryFormPage';
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
      <Route path="/catalogrequests" element={withAdmin(<CatalogRequestListPage />)} />
      <Route
        key="/catalogrequests/new"
        path="/catalogrequests/new"
        element={withAdmin(<CatalogRequestFormPage mode="create" />)}
      />
      <Route
        key="/catalogrequests/:id"
        path="/catalogrequests/:id"
        element={withAdmin(<CatalogRequestDetailPage />)}
      />
      <Route
        key="/catalogrequests/:id/edit"
        path="/catalogrequests/:id/edit"
        element={withAdmin(<CatalogRequestFormPage mode="edit" />)}
      />
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

  if (config.key === 'blog') {
    return [
      <Route key={config.basePath} path={config.basePath} element={withAdmin(<BlogListPage />)} />,
      <Route
        key="/blog/new"
        path="/blog/new"
        element={withAdmin(<BlogFormPage mode="create" />)}
      />,
      <Route key="/blog/:id" path="/blog/:id" element={withAdmin(<BlogDetailPage />)} />,
      <Route
        key="/blog/:id/edit"
        path="/blog/:id/edit"
        element={withAdmin(<BlogFormPage mode="edit" />)}
      />,
    ];
  }

  if (config.key === 'industries') {
    return [
      <Route
        key={config.basePath}
        path={config.basePath}
        element={withAdmin(<IndustryListPage />)}
      />,
      <Route
        key="/industries/new"
        path="/industries/new"
        element={withAdmin(<IndustryFormPage mode="create" />)}
      />,
      <Route
        key="/industries/:id"
        path="/industries/:id"
        element={withAdmin(<IndustryDetailPage />)}
      />,
      <Route
        key="/industries/:id/edit"
        path="/industries/:id/edit"
        element={withAdmin(<IndustryFormPage mode="edit" />)}
      />,
    ];
  }

  if (config.key === 'drawing-requests') {
    return [
      <Route
        key={config.basePath}
        path={config.basePath}
        element={withAdmin(<DrawingRequestListPage />)}
      />,
      <Route
        key="/drawing-requests/:id"
        path="/drawing-requests/:id"
        element={withAdmin(<DrawingRequestDetailPage />)}
      />,
      <Route
        key="/drawing-requests/:id/edit"
        path="/drawing-requests/:id/edit"
        element={withAdmin(<DrawingRequestFormPage />)}
      />,
    ];
  }

  if (config.key === 'enquiries') {
    return [
      <Route
        key={config.basePath}
        path={config.basePath}
        element={withAdmin(<EnquiryListPage />)}
      />,
      <Route
        key="/enquiries/:id"
        path="/enquiries/:id"
        element={withAdmin(<EnquiryDetailPage />)}
      />,
      <Route
        key="/enquiries/:id/edit"
        path="/enquiries/:id/edit"
        element={withAdmin(<EnquiryFormPage />)}
      />,
    ];
  }

  if (config.key === 'leads') {
    return [
      <Route key={config.basePath} path={config.basePath} element={withAdmin(<LeadListPage />)} />,
      <Route key="/leads/:id" path="/leads/:id" element={withAdmin(<LeadDetailPage />)} />,
      <Route key="/leads/:id/edit" path="/leads/:id/edit" element={withAdmin(<LeadFormPage />)} />,
    ];
  }

  if (config.key === 'materials') {
    return [
      <Route
        key={config.basePath}
        path={config.basePath}
        element={withAdmin(<MaterialListPage />)}
      />,
      <Route
        key="/materials/new"
        path="/materials/new"
        element={withAdmin(<MaterialFormPage mode="create" />)}
      />,
      <Route
        key="/materials/:id"
        path="/materials/:id"
        element={withAdmin(<MaterialDetailPage />)}
      />,
      <Route
        key="/materials/:id/edit"
        path="/materials/:id/edit"
        element={withAdmin(<MaterialFormPage mode="edit" />)}
      />,
    ];
  }

  if (config.key === 'brands') {
    return [
      <Route key={config.basePath} path={config.basePath} element={withAdmin(<BrandListPage />)} />,
      <Route
        key="/brands/new"
        path="/brands/new"
        element={withAdmin(<BrandFormPage mode="create" />)}
      />,
      <Route key="/brands/:id" path="/brands/:id" element={withAdmin(<BrandDetailPage />)} />,
      <Route
        key="/brands/:id/edit"
        path="/brands/:id/edit"
        element={withAdmin(<BrandFormPage mode="edit" />)}
      />,
    ];
  }

  if (config.key === 'categories') {
    return [
      <Route
        key={config.basePath}
        path={config.basePath}
        element={withAdmin(<CategoryListPage />)}
      />,
      <Route
        key="/categories/new"
        path="/categories/new"
        element={withAdmin(<CategoryFormPage mode="create" />)}
      />,
      <Route
        key="/categories/:id"
        path="/categories/:id"
        element={withAdmin(<CategoryDetailPage />)}
      />,
      <Route
        key="/categories/:id/edit"
        path="/categories/:id/edit"
        element={withAdmin(<CategoryFormPage mode="edit" />)}
      />,
    ];
  }

  if (config.key === 'products') {
    return [
      <Route key={config.basePath} path={config.basePath} element={withAdmin(<ProductListPage />)} />,
      <Route key="/products/new" path="/products/new" element={withAdmin(<ProductFormPage mode="create" />)} />,
      <Route key="/products/:id" path="/products/:id" element={withAdmin(<ProductDetailPage />)} />,
      <Route key="/products/:id/edit" path="/products/:id/edit" element={withAdmin(<ProductFormPage mode="edit" />)} />,
    ];
  }

  if (config.key === 'subcategories') {
    return [
      <Route key={config.basePath} path={config.basePath} element={withAdmin(<SubcategoryListPage />)} />,
      <Route key="/subcategories/new" path="/subcategories/new" element={withAdmin(<SubcategoryFormPage mode="create" />)} />,
      <Route key="/subcategories/:id" path="/subcategories/:id" element={withAdmin(<SubcategoryDetailPage />)} />,
      <Route key="/subcategories/:id/edit" path="/subcategories/:id/edit" element={withAdmin(<SubcategoryFormPage mode="edit" />)} />,
    ];
  }

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
