import { MissingBackendApiError } from '../repositories/apiRepository';

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
  async uploadImage(_file, _options) {
    throw new MissingBackendApiError('uploadImage', 'uploads');
  },

  async uploadPdf(_file, _options) {
    throw new MissingBackendApiError('uploadPdf', 'uploads');
  },

  async uploadMultipart(_files, _options) {
    throw new MissingBackendApiError('uploadMultipart', 'uploads');
  },
};
