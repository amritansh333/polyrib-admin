import api from '../lib/api';
import { MissingBackendApiError } from '../lib/api';

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

function normalizeUploadFolder(resourceKey?: string) {
  return resourceKey?.replaceAll('|', '').replaceAll(' ', '-') || 'misc';
}

function toUploadedAsset(file: File, payload: any): UploadedAsset {
  return {
    id: payload.filename ?? payload.url ?? file.name,
    url: payload.url,
    name: payload.originalname ?? file.name,
    mimeType: payload.mimetype ?? file.type,
    size: payload.size ?? file.size,
  };
}

async function uploadSingle(file: File, options?: UploadOptions) {
  const folder = normalizeUploadFolder(options?.resourceKey);
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/admin/uploads/single', formData, {
    params: { folder },
    onUploadProgress(event) {
      if (options?.onUploadProgress && event.total) {
        options.onUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

  return toUploadedAsset(file, response.data.data);
}

export const uploadService: UploadService = {
  async uploadImage(file, options) {
    return uploadSingle(file, options);
  },

  async uploadPdf(file, options) {
    return uploadSingle(file, options);
  },

  async uploadMultipart(files, options) {
    const uploads = await Promise.all(files.map((file) => uploadSingle(file, options)));
    return uploads;
  },
};
