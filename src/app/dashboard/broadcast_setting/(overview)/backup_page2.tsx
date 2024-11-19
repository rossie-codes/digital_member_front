// 完成基本頁面列表，有新增，有 bulk action button

// 想新增頁面增加 列表 column 及 filter function


// // src/app/dashboard/broadcast_setting/page.tsx

// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Button,
//   Checkbox,
//   DatePicker,
//   Form,
//   Input,
//   Modal,
//   Radio,
//   Select,
//   Space,
//   Table,
//   message,
//   Dropdown
// } from "antd";
// import type { TableColumnsType, PaginationProps } from "antd";
// import { PlusOutlined, FormOutlined, DeleteOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
// import { useRouter } from "next/navigation";
// import dayjs from "dayjs";

// const { Search } = Input;

// interface DataType {
//   key: string;
//   broadcast_name: string;
//   wati_template: string;
//   scheduled_start: string;
//   recipient_count: number;
// }

// interface FetchParams {
//   page: number;
//   pageSize: number;
//   sortField?: string;
//   sortOrder?: string;
//   filters?: any;
//   searchText?: string;
// }

// interface WatiTemplate {
//   id: string;
//   name: string;
//   // Include other relevant fields
// }

// interface Member {
//   id: string;
//   name: string;
//   phone_number: string;
//   status: string;
// }

// const BroadcastSettingPage: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error | null>(null);
//   const hasFetched = useRef(false);

//   const router = useRouter();
//   const handleEdit = (record: DataType) => {
//     router.push(`/dashboard/broadcast_setting/${record.key}/edit`);
//   };

//   const [data, setData] = useState<DataType[]>([]);
//   const [searchText, setSearchText] = useState<string>("");
//   const showTotal: PaginationProps["showTotal"] = (total) =>
//     `Total ${total} items`;

//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [pageSize, setPageSize] = useState<number>(10);
//   const [totalItems, setTotalItems] = useState<number>(0);

//   // State variables for modal and form
//   const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
//   const [broadcastForm] = Form.useForm(); // Form instance for the modal

//   // State variables for WATI templates
//   const [watiTemplates, setWatiTemplates] = useState<WatiTemplate[]>([]);
//   const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);

//   const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

//   // State variables for members
//   const [members, setMembers] = useState<Member[]>([]);
//   const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
//   const [memberSearchText, setMemberSearchText] = useState<string>("");
//   const [memberFilters, setMemberFilters] = useState({});
//   const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

//   const fetchData = async (params: FetchParams = { page: 1, pageSize: 10 }) => {
//     setLoading(true);
//     try {
//       const { page, pageSize, sortField, sortOrder, filters, searchText } =
//         params;

//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         pageSize: pageSize.toString(),
//       });
//       if (sortField) queryParams.append("sortField", sortField);
//       if (sortOrder) queryParams.append("sortOrder", sortOrder);

//       if (searchText) {
//         queryParams.append("searchText", searchText);
//       }

//       const response = await fetch(
//         `${
//           process.env.NEXT_PUBLIC_API_URL
//         }/broadcast_setting/get_broadcast_list?${queryParams.toString()}`,
//         {
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const jsonData = await response.json();

//       const broadcasts: any[] = jsonData.data;
//       const total: number = jsonData.total;

//       if (!Array.isArray(broadcasts)) {
//         throw new Error(
//           "Invalid data format: 'broadcasts' should be an array."
//         );
//       }

//       const formattedData: DataType[] = broadcasts.map((broadcast: any) => ({
//         key: broadcast.broadcast_id
//           ? broadcast.broadcast_id.toString()
//           : Math.random().toString(),
//         broadcast_name: broadcast.broadcast_name || "N/A",
//         wati_template: broadcast.wati_template || "N/A",
//         scheduled_start: broadcast.scheduled_start
//           ? formatDate(broadcast.scheduled_start)
//           : "N/A",
//         recipient_count: broadcast.recipient_count || 0,
//       }));

//       setData(formattedData);
//       setTotalItems(total);
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const rowSelection = {
//     selectedRowKeys,
//     onChange: (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
//       setSelectedRowKeys(newSelectedRowKeys);
//       // Optionally, you can also store the selectedRows for future use
//     },
//     // Uncomment below if you want to disable selection for certain rows

//     // getCheckboxProps: (record: DataType) => ({
//     //   disabled: record.name === 'Disabled Broadcast', // Disable checkbox for specific rows
//     // }),
//   };

//   const formatDate = (isoString: string): string => {
//     if (!isoString) return "N/A";
//     const date = new Date(isoString);
//     if (isNaN(date.getTime())) return "Invalid Date";
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     return `${year}-${month}-${day} ${hours}:${minutes}`;
//   };

//   // Fetch data when component mounts
//   useEffect(() => {
//     if (!hasFetched.current) {
//       hasFetched.current = true;
//       fetchData({
//         page: currentPage,
//         pageSize: pageSize,
//         searchText: searchText,
//       });
//     }
//   }, [currentPage, pageSize, searchText]);

//   const onSearch = (value: string) => {
//     const trimmedValue = value.trim();
//     setSearchText(trimmedValue);

//     // Reset pagination to the first page when a new search is performed
//     setCurrentPage(1);

//     fetchData({
//       page: 1,
//       pageSize: pageSize,
//       searchText: trimmedValue,
//     });
//   };

//   const columns: TableColumnsType<DataType> = [
//     {
//       title: "Broadcast Name",
//       dataIndex: "broadcast_name",
//       key: "broadcast_name",
//     },
//     {
//       title: "WATI Template",
//       dataIndex: "wati_template",
//       key: "wati_template",
//     },
//     {
//       title: "Scheduled Start",
//       dataIndex: "scheduled_start",
//       key: "scheduled_start",
//       sorter: true,
//       sortDirections: ["ascend", "descend"],
//     },
//     {
//       title: "Recipient Count",
//       dataIndex: "recipient_count",
//       key: "recipient_count",
//       sorter: true,
//       sortDirections: ["ascend", "descend"],
//       align: "right",
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_: any, record: DataType) => (
//         <Button
//           type="link"
//           icon={<FormOutlined style={{ color: "#ff4d4f" }} />}
//           onClick={() => handleEdit(record)}
//         />
//       ),
//     },
//   ];

//   const handleTableChange = (pagination: any, filters: any, sorter: any) => {
//     setCurrentPage(pagination.current);
//     setPageSize(pagination.pageSize);

//     // Prepare sort parameters
//     let sortField = sorter.field;
//     let sortOrder = sorter.order;
//     if (sortOrder) {
//       sortOrder = sorter.order === "ascend" ? "ascend" : "descend";
//     }

//     // Fetch data based on the new pagination and sorting
//     fetchData({
//       page: pagination.current,
//       pageSize: pagination.pageSize,
//       sortField: sortField,
//       sortOrder: sortOrder,
//       searchText: searchText,
//     });
//   };

//   // Fetch WATI templates and members when modal opens
//   useEffect(() => {
//     if (isModalVisible) {
//       fetchWatiTemplates();
//       fetchMembers();
//     } else {
//       // Reset form and selections when modal closes
//       broadcastForm.resetFields();
//       setSelectedMembers([]);
//       setMemberSearchText("");
//     }
//   }, [isModalVisible]);

//   const fetchWatiTemplates = async () => {
//     setLoadingTemplates(true);
//     try {
//       // Fetch templates from WATI (replace with actual API call)
//       const response = await fetch("/api/wati/templates");
//       if (!response.ok) {
//         throw new Error(`Error fetching WATI templates: ${response.status}`);
//       }
//       const templatesData = await response.json();
//       setWatiTemplates(templatesData);
//     } catch (error) {
//       console.error("Error fetching WATI templates:", error);
//       message.error("Failed to fetch WATI templates.");
//     } finally {
//       setLoadingTemplates(false);
//     }
//   };

//   const fetchMembers = async (searchText = "", filters = {}) => {
//     setLoadingMembers(true);
//     try {
//       // Fetch members (replace with actual API call)
//       const queryParams = new URLSearchParams();
//       if (searchText) {
//         queryParams.append("search", searchText);
//       }
//       // Add filters if any

//       const response = await fetch(`/api/members?${queryParams.toString()}`);
//       if (!response.ok) {
//         throw new Error(`Error fetching members: ${response.status}`);
//       }
//       const membersData = await response.json();
//       setMembers(membersData);
//     } catch (error) {
//       console.error("Error fetching members:", error);
//       message.error("Failed to fetch members.");
//     } finally {
//       setLoadingMembers(false);
//     }
//   };

//   const handleMemberSelect = (memberId: string, checked: boolean) => {
//     if (checked) {
//       setSelectedMembers([...selectedMembers, memberId]);
//     } else {
//       setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
//     }
//   };

//   const memberColumns: TableColumnsType<Member> = [
//     {
//       title: "",
//       dataIndex: "checkbox",
//       render: (_: any, record: Member) => (
//         <Checkbox
//           checked={selectedMembers.includes(record.id)}
//           onChange={(e) => handleMemberSelect(record.id, e.target.checked)}
//         />
//       ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Phone Number",
//       dataIndex: "phone_number",
//       key: "phone_number",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//     },
//   ];

//   const handleMemberSearch = (value: string) => {
//     setMemberSearchText(value);
//     fetchMembers(value, memberFilters);
//   };

//   const handleCreateBroadcast = async (values: any) => {
//     const memberIds = selectedMembers;

//     if (memberIds.length === 0) {
//       message.error("Please select at least one member.");
//       return;
//     }

//     const dataToSubmit = {
//       ...values,
//       member_ids: memberIds,
//     };

//     try {
//       // Submit broadcast creation (replace with actual API call)
//       const response = await fetch("/api/broadcasts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dataToSubmit),
//       });
//       if (!response.ok) {
//         throw new Error(`Error creating broadcast: ${response.status}`);
//       }
//       message.success("Broadcast created successfully");
//       setIsModalVisible(false);
//       // Refresh the list
//       fetchData({
//         page: currentPage,
//         pageSize: pageSize,
//         searchText: searchText,
//       });
//     } catch (error) {
//       console.error("Error creating broadcast:", error);
//       message.error("Error creating broadcast");
//     }
//   };

//   if (error) return <p>Error: {error.message}</p>;

//   const menuProps = {
//     // items,
//     // onClick: handleMenuClick,
//   };

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Space direction="horizontal" style={{ marginBottom: "20px" }}>
//           <Search
//             placeholder="Search broadcasts"
//             allowClear
//             onSearch={onSearch}
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{ width: 300 }}
//           />
//           <Button type="primary" onClick={() => setIsModalVisible(true)}>
//             New Broadcast
//           </Button>

//           <Dropdown menu={menuProps} disabled={selectedRowKeys.length === 0}>
//             <Button>
//               Bulk Actions <DownOutlined />
//             </Button>
//           </Dropdown>
//         </Space>
//       </div>


//       {/* Modal for New Broadcast */}
//       <Modal
//         title="New Broadcast"
//         open={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         width={800}
//         footer={null}
//       >
//         <Form
//           form={broadcastForm}
//           layout="vertical"
//           onFinish={handleCreateBroadcast}
//         >
//           {/* Broadcast Name */}
//           <Form.Item
//             label="Broadcast Name"
//             name="broadcast_name"
//             rules={[
//               { required: true, message: "Please input the broadcast name!" },
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           {/* Template Message Selection */}
//           <Form.Item
//             label="Template Message"
//             name="wati_template"
//             rules={[
//               { required: true, message: "Please select a template message!" },
//             ]}
//           >
//             <Select loading={loadingTemplates}>
//               {watiTemplates.map((template) => (
//                 <Select.Option key={template.id} value={template.id}>
//                   {template.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {/* Schedule Type */}
//           <Form.Item
//             label="Schedule Type"
//             name="schedule_type"
//             rules={[
//               { required: true, message: "Please select a schedule type!" },
//             ]}
//           >
//             <Radio.Group>
//               <Radio value="now">Send Now</Radio>
//               <Radio value="later">Schedule for Later</Radio>
//             </Radio.Group>
//           </Form.Item>

//           {/* Conditional Scheduled Time */}
//           {broadcastForm.getFieldValue("schedule_type") === "later" && (
//             <Form.Item
//               label="Scheduled Time"
//               name="scheduled_time"
//               rules={[
//                 { required: true, message: "Please select a scheduled time!" },
//               ]}
//             >
//               <DatePicker
//                 showTime
//                 style={{ width: "100%" }}
//                 disabledDate={(current) =>
//                   current && dayjs(current).isBefore(dayjs().startOf("day"))
//                 }
//               />
//             </Form.Item>
//           )}

//           {/* Member Selection */}
//           <Form.Item label="Member Selection" required>
//             <Space style={{ marginBottom: 16 }}>
//               <Input.Search
//                 placeholder="Search members"
//                 value={memberSearchText}
//                 onChange={(e) => setMemberSearchText(e.target.value)}
//                 onSearch={handleMemberSearch}
//                 style={{ width: 300 }}
//               />
//               <Button
//                 onClick={() => {
//                   // Implement filter functionality here
//                   message.info("Filters feature is not implemented yet.");
//                 }}
//               >
//                 Filters
//               </Button>
//             </Space>

//             <Table
//               dataSource={members}
//               columns={memberColumns}
//               rowKey="id"
//               loading={loadingMembers}
//               pagination={{ pageSize: 5 }}
//             />
//           </Form.Item>

//           {/* Submit Button */}
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Create Broadcast
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Existing Table */}
//       <Table
//         rowSelection={rowSelection}
//         dataSource={data}
//         columns={columns}
//         locale={{ emptyText: "No broadcasts found." }}
//         pagination={{
//           current: currentPage,
//           pageSize: pageSize,
//           total: totalItems,
//           showTotal: showTotal,
//           showSizeChanger: true,
//           showQuickJumper: true,
//           position: ["bottomRight"],
//         }}
//         loading={loading}
//         onChange={handleTableChange}
//       />
//     </div>
//   );
// };

// export default BroadcastSettingPage;
