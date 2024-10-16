// 完成：基本有個表，有取得資料

// 想按 member_list 的方式做一樣

// // src/app/dashboard/discount_code_list/page.tsx

// "use client"

// import React, { useState, useEffect } from 'react';
// import type { TableColumnsType, TableProps } from 'antd';
// import { Button, Space, Table } from 'antd';
// import { fetchData } from '@/app/lib/api/wati_list';

// interface DataType {
//   key: string;
//   name: string;
//   phone: number | string;
// }

// const data: DataType[] = [];

// type OnChange = NonNullable<TableProps<DataType>['onChange']>;
// type Filters = Parameters<OnChange>[1];

// type GetSingle<T> = T extends (infer U)[] ? U : never;
// type Sorts = GetSingle<Parameters<OnChange>[2]>;




// const GetDiscountCodeListPage: React.FC = () => {

//   const [watiContacts, setWatiContacts] = useState<DataType[]>([]);

//   useEffect(() => {
//     const getContacts = async () => {
//       try {
//         const data = await fetchData();
//         // const data = response.json(); // Assuming fetchData returns a Response object
//         console.log("Raw Data from API data:", data);

//         const extractedContacts = data.contact_list.map((contact: any, index: number) => ({
//           key: contact.id || index.toString(), // Use contact.id if available, otherwise use index
//           name: contact.fullName,
//           phone: contact.phone,
//           // Map other properties as needed:
//           // created: contact.created,
//           // source: contact.source, 
//         }));

//         console.log("Raw Data from API extractedContacts:", extractedContacts);
//         setWatiContacts(extractedContacts);

//       } catch (error) {
//         console.error('Error fetching contacts :', error);
//         // Handle the error appropriately (e.g., display an error message)
//       }
//     };

//     getContacts();
//   }, []);


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
//       sorter: (a, b) => a.name.length - b.name.length,
//       sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
//       ellipsis: true,
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phone',
//       key: 'phone',
//       // sorter: (a, b) => a.phone - b.phone,
//       sortOrder: sortedInfo.columnKey === 'phone' ? sortedInfo.order : null,
//       ellipsis: true,
//     },
//     {
//       title: 'Age',
//       dataIndex: 'age',
//       key: 'age',
//       // sorter: (a, b) => a.age - b.age,
//       sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
//       ellipsis: true,
//     },
//   ];
//   const top = 'none';
//   const bottom = 'bottomRight';
//   // const [tableParams, setTableParams] = useState<TableParams>({
//   //   pagination: {
//   //     current: 1,
//   //     pageSize: 1,
//   //     position: ['none', 'bottomright']
//   //   },
//   // });
//   // const tableParams = {
//   //     // current: 1,
//   //     // pageSize: 20,
//   //     position: ['none', 'bottomright']
//   //   }

//   return (
//     <>
//       <Space style={{ marginBottom: 16 }}>
//         <Button onClick={setAgeSort}>Sort age</Button>
//         <Button onClick={clearFilters}>Clear filters</Button>
//         <Button onClick={clearAll}>Clear filters and sorters</Button>
//       </Space>
//       <Table columns={columns} dataSource={watiContacts} onChange={handleChange} />

//     </>
//   );
// };

// export default GetDiscountCodeListPage;