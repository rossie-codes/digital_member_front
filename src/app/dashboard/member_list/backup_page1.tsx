
// 解決了 backend data [promise, object] 問題
// 現在要將 data 放入 ant table 內

// 'use client';
// import { useEffect, useState, useRef } from 'react';
// import { Table } from 'antd'; // Import only what you need in the Client Component



// interface DataType {
//   key: string;
//   name: string;
//   phone: number | string;
// }

// const data: DataType[] = [];

// function App() {
//   const [data, setData] = useState<DataType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const hasFetched = useRef(false);

//   useEffect(() => {
//     if (!hasFetched.current) {  // Only fetch if it hasn't happened yet
//       hasFetched.current = true; // Prevent subsequent fetches
//       console.log("useEffect is running")
//       const fetchData = async () => {
//         try {
//           const response = await fetch('http://localhost:3000/member');

//           console.log('Response OK:', response.ok);

//           const responseClone = response.clone();
//           const responseText = await responseClone.text();
//           console.log('Response body:', responseText);  // Should be the JSON string

//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status} ${responseText}`);
//           }

//           const jsonData = response.json();

//           console.log(jsonData);


//           const targetData = jsonData.

//           setData(targetData);
//         } catch (err) {
//           console.error("Fetch error:", err);
//           setError(err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchData(); // Call the async function  
//     };
//   }, []); // Empty dependency array to run the effect only once

//   if (loading) return <p>Loading...</p>; // Display loading message
//   if (error) return <p>Error: {error.message}</p>; // Display error message

//   const columns = [
//     {

//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phone',
//       key: 'phone',
//     }
//   ];

//   return (
//     <Table dataSource={data} columns={columns} />
//   );
// }

// export default App;
