export interface UploadApiResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string; // "image", "video", "raw"
  created_at: string;
  tags: string[];
  bytes: number;
  type: string; // "upload"
  etag: string;
  placeholder?: boolean;
  url: string;         // HTTP URL (non-HTTPS)
  secure_url: string;  // HTTPS URL (ini yang paling sering dipakai)
  access_mode?: string;
  original_filename: string;
  api_key?: string;
  // Tambahan opsional
  moderation?: string[];
  context?: any;
  metadata?: any;
  delete_token?: string;
}