// "use client"

// import React, { useState } from 'react';
// import type { TableColumnsType, TableProps } from 'antd';
// import { Button, Space, Table } from 'antd';
// import { fetchData } from '@/app/lib/api/wati_list'; 

// interface DataType {
//   key: string;
//   name: string;
//   phone: number;
// }

// const data: DataType[] = [];

// type OnChange = NonNullable<TableProps<DataType>['onChange']>;
// type Filters = Parameters<OnChange>[1];

// type GetSingle<T> = T extends (infer U)[] ? U : never;
// type Sorts = GetSingle<Parameters<OnChange>[2]>;




// const App: React.FC = () => {
//   const [filteredInfo, setFilteredInfo] = useState<Filters>({});
//   const [sortedInfo, setSortedInfo] = useState<Sorts>({});

//   const handleChange: OnChange = (pagination, filters, sorter) => {
//     console.log('Various parameters', pagination, filters, sorter);
//     setFilteredInfo(filters);
//     setSortedInfo(sorter as Sorts);
//   };

//   const clearFilters = () => {
//     setFilteredInfo({});
//   };

//   const clearAll = () => {
//     setFilteredInfo({});
//     setSortedInfo({});
//   };

//   const setAgeSort = () => {
//     setSortedInfo({
//       order: 'descend',
//       columnKey: 'age',
//     });
//   };

//   const columns: TableColumnsType<DataType> = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       filters: [
//         { text: 'Joe', value: 'Joe' },
//         { text: 'Jim', value: 'Jim' },
//       ],
//       filteredValue: filteredInfo.name || null,
//       onFilter: (value, record) => record.name.includes(value as string),
//       sorter: (a, b) => a.name.length - b.name.length,
//       sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
//       ellipsis: true,
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phone',
//       key: 'phone',
//       sorter: (a, b) => a.phone - b.phone,
//       sortOrder: sortedInfo.columnKey === 'phone' ? sortedInfo.order : null,
//       ellipsis: true,
//     },
//     {
//       title: 'Age',
//       dataIndex: 'age',
//       key: 'age',
//       sorter: (a, b) => a.age - b.age,
//       sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
//       ellipsis: true,
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       key: 'address',
//       filters: [
//         { text: 'London', value: 'London' },
//         { text: 'New York', value: 'New York' },
//       ],
//       filteredValue: filteredInfo.address || null,
//       onFilter: (value, record) => record.address.includes(value as string),
//       sorter: (a, b) => a.address.length - b.address.length,
//       sortOrder: sortedInfo.columnKey === 'address' ? sortedInfo.order : null,
//       ellipsis: true,
//     },
//   ];

//   return (
//     <>
//       <Space style={{ marginBottom: 16 }}>
//         <Button onClick={setAgeSort}>Sort age</Button>
//         <Button onClick={clearFilters}>Clear filters</Button>
//         <Button onClick={clearAll}>Clear filters and sorters</Button>
//       </Space>
//       <Table columns={columns} dataSource={data} onChange={handleChange} />
//     </>
//   );
// };

// export default App;