// try to fix onSearch

// 'use client';
// import { useEffect, useState, useRef } from 'react';
// import { Table } from 'antd'; // Import only what you need in the Client Component
// import { Input, Space } from 'antd';
// import type { GetProps } from 'antd';

// type SearchProps = GetProps<typeof Input.Search>;

// const { Search } = Input;
// const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

// interface DataType {
//   key: string;
//   member_name: string;
//   member_tel: string | number;
//   point: string | number;
//   membership_tier: string;
//   membership_expiry_date: string; // Formatted date
//   member_tags: string[];
// }

// function App() {
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
//           const response = await fetch('http://localhost:3000/member');

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

//           // Assuming the JSON response has a structure like:
//           // { "members": [ { "member_name": "John Doe", "member_tel": "1234567890", ... }, ... ] }
//           const members = jsonData;

//           if (!Array.isArray(members)) {
//             throw new Error("Invalid data format: 'members' should be an array.");
//           }

//           // Helper function to format the date
//           const formatDate = (isoString: string): string => {
//             // Option 1: Simple split (works if format is consistent)
//             // return isoString.split('T')[0];

//             // Option 2: Using JavaScript Date object
//             const date = new Date(isoString);
//             const year = date.getFullYear();
//             const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//             const day = String(date.getDate()).padStart(2, '0');
//             return `${year}-${month}-${day}`;

//             // Option 3: Using Intl.DateTimeFormat for more flexibility
//             // return new Intl.DateTimeFormat('en-CA').format(date); // Outputs YYYY-MM-DD
//           };

//           // Map the fetched members to the DataType structure with formatted date
//           const formattedData: DataType[] = members.map((member: any, index: number) => ({
//             key: index.toString(), // Use a unique key; here, the index is used for simplicity
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


//   // Search handler
//   const onSearch: InputProps['onSearch'] = (value) => {
//     setSearchText(value.trim().toLowerCase());
//   };

//   // Filtered data based on searchText
//   const filteredData = data.filter(item =>
//     item.member_name.toLowerCase().includes(searchText) ||
//     String(item.member_tel).toLowerCase().includes(searchText)
//   );

//   const columns = [
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
//     },
//     {
//       title: 'Membership Tier',
//       dataIndex: 'membership_tier',
//       key: 'membership_tier',
//     },
//     {
//       title: 'Expiry Date',
//       dataIndex: 'membership_expiry_date',
//       key: 'membership_expiry_date',
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
//         locale={{ emptyText: 'No members found.' }} // Optional: Custom empty text
//       />
//     </div>
//   );
// }

// export default App;