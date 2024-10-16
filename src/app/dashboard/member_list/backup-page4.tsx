// 已完成 search

// 想加入「新增會員」的 button

// // src/app/dashboard/member_list/page.tsx

// 'use client';
// import { useEffect, useState, useRef } from 'react';
// import { Table, Input, Space, Button, Modal, Form, message } from 'antd';
// import { ColumnsType } from 'antd/es/table';
// import { Pagination } from 'antd';


// const { Search } = Input;

// interface DataType {
//   key: string;
//   member_name: string;
//   member_tel: string | number;
//   point: string | number;
//   membership_tier: string;
//   membership_expiry_date: string; // Formatted date
//   // member_tags: string[]; // Uncomment if you decide to use it
// }

// function GetGiftListPage() {
//   const [data, setData] = useState<DataType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error | null>(null);
//   const hasFetched = useRef(false);
//   const [searchText, setSearchText] = useState<string>(''); // State for search text

//   useEffect(() => {
//     if (!hasFetched.current) { // Only fetch if it hasn't happened yet
//       hasFetched.current = true; // Prevent subsequent fetches
//       console.log("useEffect is running");

//       const fetchData = async () => {
//         try {
//           const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/get_member_list');

//           console.log('Response OK:', response.ok);

//           const responseClone = response.clone();
//           const responseText = await responseClone.text();
//           console.log('Response body:', responseText); // Logs the raw JSON string

//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status} ${responseText}`);
//           }

//           // Properly await the JSON parsing
//           const jsonData = await response.json();
//           console.log('Parsed JSON Data:', jsonData);

//           // Assuming the JSON response is an array of members
//           const members: any[] = jsonData;

//           if (!Array.isArray(members)) {
//             throw new Error("Invalid data format: 'members' should be an array.");
//           }

//           // Helper function to format the date
//           const formatDate = (isoString: string): string => {
//             const date = new Date(isoString);
//             const year = date.getFullYear();
//             const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//             const day = String(date.getDate()).padStart(2, '0');
//             return `${year}-${month}-${day}`;
//           };

//           // Map the fetched members to the DataType structure with formatted date
//           const formattedData: DataType[] = members.map((member: any) => ({
//             key: member.id ? member.id.toString() : Math.random().toString(), // Prefer unique id
//             member_name: member.member_name || 'N/A', // Fallback to 'N/A' if the field is missing
//             member_tel: member.member_tel || 'N/A', // Fallback to 'N/A' if the field is missing
//             point: member.point || 'N/A', // Fallback to 'N/A' if the field is missing
//             membership_tier: member.membership_tier || 'N/A', // Fallback to 'N/A' if the field is missing
//             membership_expiry_date: member.membership_expiry_date
//               ? formatDate(member.membership_expiry_date)
//               : 'N/A', // Format the date or fallback to 'N/A'
//           }));

//           setData(formattedData);
//         } catch (err: any) { // Using 'any' to avoid TypeScript issues; ideally, you should type this properly
//           console.error("Fetch error:", err);
//           setError(err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchData(); // Call the async function  
//     }
//   }, []); // Empty dependency array to run the effect only once

//   // Search handler without explicit type
//   const onSearch = (
//     value: string,
//     // event?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>,
//     // info?: any
//   ) => {
//     setSearchText(value.trim().toLowerCase());
//   };

//   // Filtered data based on searchText
//   const filteredData = data.filter(item =>
//     item.member_name.toLowerCase().includes(searchText) ||
//     String(item.member_tel).toLowerCase().includes(searchText)
//   );

//   const columns: ColumnsType<DataType> = [
//     {
//       title: 'Name',
//       dataIndex: 'member_name',
//       key: 'member_name',
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'member_tel',
//       key: 'member_tel',
//     },
//     {
//       title: 'Point',
//       dataIndex: 'point',
//       key: 'point',
//       sorter: (a:DataType, b:DataType) => Number(a.point) - Number(b.point),
//       sortDirections: ['ascend', 'descend', 'ascend'],
//     },
//     {
//       title: 'Membership Tier',
//       dataIndex: 'membership_tier',
//       key: 'membership_tier',
//       filters: [
//         { text: 'London', value: 'London' },
//         { text: 'New York', value: 'New York' },
//       ],
//     },
//     {
//       title: 'Expiry Date',
//       dataIndex: 'membership_expiry_date',
//       key: 'membership_expiry_date',
//       sorter: (a:DataType, b:DataType) => Number(a.membership_expiry_date) - Number(b.membership_expiry_date),
//       sortDirections: ['ascend', 'descend', 'ascend'],
//     },
//   ];

//   if (loading) return <p>Loading...</p>; // Display loading message
//   if (error) return <p>Error: {error.message}</p>; // Display error message

//   return (
//     <div>
//       <Space direction="vertical" style={{ marginBottom: '50px' }}>
//         <Search
//           placeholder="Search members"
//           allowClear
//           onSearch={onSearch}
//           style={{ width: 300 }}
//         />
//       </Space>

//       <Table
//         dataSource={filteredData}
//         columns={columns}
//         locale={{ emptyText: 'No members found.' }}
//         // pagination={false}
//         pagination={{ position: ['none', 'bottomRight'] }}
//       // Optional: Custom empty text
//       />
//       {/* <Pagination
//         total={85}
//         showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
//         defaultPageSize={50}
//         defaultCurrent={1}
//       /> */}
//     </div>
//   );
// }

// export default GetGiftListPage;