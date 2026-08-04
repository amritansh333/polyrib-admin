import api from '../lib/api';
import type { UploadAssetDto } from '../repositories/dto';

export type UploadOptions = {
  resourceKey?: string;
  onUploadProgress?: (progress: number) => void;
};

export type UploadedAsset = {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  size: number;
};

export type UploadService = {
  uploadImage(file: File, options?: UploadOptions): Promise<UploadedAsset>;
  uploadPdf(file: File, options?: UploadOptions): Promise<UploadedAsset>;
  uploadMultipart(files: File[], options?: UploadOptions): Promise<UploadedAsset[]>;
};

export const uploadService: UploadService = {
  async uploadImage(file, options) {
    return uploadSingle(file, 'images', options);
  },

  async uploadPdf(file, options) {
    return uploadSingle(file, 'pdfs', options);
  },

  async uploadMultipart(files, options) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (options?.resourceKey) formData.append('resourceKey', options.resourceKey);

    const response = await api.post<UploadAssetDto[]>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => reportProgress(event.loaded, event.total, options),
    });

    return response.data.map(toUploadedAsset);
  },
};

async function uploadSingle(file: File, type: 'images' | 'pdfs', options?: UploadOptions) {
  const formData = new FormData();
  formData.append('file', file);
  if (options?.resourceKey) formData.append('resourceKey', options.resourceKey);

  const response = await api.post<UploadAssetDto>(`/uploads/${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => reportProgress(event.loaded, event.total, options),
  });

  return toUploadedAsset(response.data);
}

function toUploadedAsset(dto: UploadAssetDto): UploadedAsset {
  return {
    id: String(dto.id ?? ''),
    url: dto.url ?? '',
    name: dto.name ?? '',
    mimeType: dto.mimeType ?? '',
    size: dto.size ?? 0,
  };
}

function reportProgress(loaded: number, total: number | undefined, options?: UploadOptions) {
  if (!total || !options?.onUploadProgress) return;
  options.onUploadProgress(Math.round((loaded / total) * 100));
}
