import type { ReactNode } from 'react';

export interface DataColumn<T> {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
}

export function DataTable<T>({ data, columns }: { data: T[]; columns: DataColumn<T>[] }) {
  if (!data.length) return <div className="empty-state">暂无数据</div>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column.key}>{column.title}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => <td key={column.key}>{column.render(item)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
