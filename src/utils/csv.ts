import type { DataEntity } from '../types/admin';

export function downloadCsv(filename: string, rows: DataEntity[]) {
  const headers = [
    'id',
    'name',
    'description',
    'status',
    'owner',
    'category',
    'brand',
    'updatedAt',
  ];
  const body = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header as keyof DataEntity] ?? '';
        return `"${String(value).replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  const blob = new Blob([[headers.join(','), ...body].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
