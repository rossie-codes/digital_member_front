// 完成原樣複製

// 想 detail page 取得原先的設定。
// 想 submit 修改，broadcast history 會將舊的 member_id 變成 edited status，加上 updated_at。再將新設定 insert。


// // src/app/dashboard/broadcast_setting/[broadcast_id]/edit/page.tsx

// "use client";
// import React, { useEffect, useState, useRef  } from "react";
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
//   Dropdown,
//   InputNumber,
//   Popconfirm,
//   Typography,
//   Badge,
//   Tag,
// } from "antd";
// import type { TableColumnsType, TableProps, PaginationProps } from "antd";
// import {
//   PlusOutlined,
//   FormOutlined,
//   DeleteOutlined,
//   UserOutlined,
//   DownOutlined,
// } from "@ant-design/icons";
// import Link from 'next/link';
// import { useRouter, useParams } from "next/navigation";
// import dayjs from "dayjs";

// const { Search } = Input;


// interface MemberFetchParams {
//   page: number;
//   pageSize: number;
//   sortField?: string;
//   sortOrder?: string;
//   filters?: any;
//   memberSearchText?: string;
//   modalMemberSearchText?: string;
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
//   membership_tier: string;
//   membership_status: string;
//   points_balance: number;
//   referral_count: number;
//   order_count: number;
// }

// const BroadcastDetailPage: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);

//   const params = useParams();
//   const broadcast_id = params.broadcast_id;

//   const [watiTemplates, setWatiTemplates] = useState<WatiTemplate[]>([]);

//   const [isFilterModalVisible, setIsFilterModalVisible] =
//     useState<boolean>(false);


//   const [error, setError] = useState<Error | null>(null);
//   const hasFetched = useRef(false);

//   const showTotal: PaginationProps["showTotal"] = (total) =>
//     `Total ${total} items`;

//   const [broadcastForm] = Form.useForm(); // Form instance for the modal
//   const [filterForm] = Form.useForm();

//   const [selectedMemberRowKeys, setSelectedMemberRowKeys] = useState<React.Key[]>([]);
//   // State variables for members
//   const [modalMembers, setModalMembers] = useState<Member[]>([]);

//   const [loadingModalMembers, setLoadingModalMembers] =
//     useState<boolean>(false);
//   const [modalMemberSearchText, setModalMemberSearchText] =
//     useState<string>("");
//   const [modalMemberFilters, setModalMemberFilters] = useState<any>({});
//   const [memberCurrentPage, setModalCurrentPage] = useState<number>(1);
//   const [memberPageSize, setModalPageSize] = useState<number>(10);
//   const [memberTotalItems, setModalTotalItems] = useState<number>(0);


//   const [selectedTemplateData, setSelectedTemplateData] = useState<any>(null);
//   const [loadingTemplateData, setLoadingTemplateData] = useState<boolean>(false);

//   // 要將各個 request 集合在一個 request，反正都是打開 modal 時發生
//   const [membershipTierOptions, setMembershipTierOptions] = useState<
//     { label: string; value: string }[]
//   >([]);


//   const handleEditBroadcast = async (values: any) => {
//     const memberIds = selectedMemberRowKeys;

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
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/broadcast_setting/put_edit_broadcast_detail/${broadcast_id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dataToSubmit),
//       });
//       if (!response.ok) {
//         throw new Error(`Error creating broadcast: ${response.status}`);
//       }
//       message.success("Broadcast created successfully");
//     } catch (error) {
//       console.error("Error creating broadcast:", error);
//       message.error("Error creating broadcast");
//     }
//   };





//   const fetchModalMembers = async (
//     params: MemberFetchParams = { page: 1, pageSize: 10 }
//   ) => {
//     setLoadingModalMembers(true);
//     try {
//       const { page, pageSize, sortField, sortOrder, filters, modalMemberSearchText } =
//         params;

//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         pageSize: pageSize.toString(),
//       });
//       if (sortField) queryParams.append("sortField", sortField);
//       if (sortOrder) queryParams.append("sortOrder", sortOrder);

//       // Include filters dynamically
//       if (filters) {
//         Object.keys(filters).forEach((key) => {
//           const filterValues = filters[key];
//           if (filterValues && filterValues.length > 0) {
//             filterValues.forEach((value: string) => {
//               queryParams.append(key, value);
//             });
//           }
//         });
//       }

//       // Include search text in the queryParams
//       if (modalMemberSearchText) {
//         queryParams.append("modalMemberSearchText", modalMemberSearchText);
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL
//         }/broadcast_setting/get_broadcast_member_list?${queryParams.toString()}`,
//         {
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const jsonData = await response.json();

//       const members: any[] = jsonData.data;
//       const total: number = jsonData.total;
//       const watiTemplateList: WatiTemplate[] = jsonData.watiTemplateList.map((template: any) => ({
//         id: template,
//         name: template,
//       }));



//       if (!Array.isArray(members)) {
//         throw new Error("Invalid data format: 'members' should be an array.");
//       }

//       const formatDate = (isoString: string): string => {
//         if (!isoString) return "N/A";
//         const date = new Date(isoString);
//         if (isNaN(date.getTime())) return "Invalid Date";
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const day = String(date.getDate()).padStart(2, "0");
//         return `${year}-${month}-${day}`;
//       };

//       const formattedData: Member[] = members.map((member: any) => ({
//         key: member.member_id.toString(),
//         id: member.member_id.toString(),
//         name: member.member_name || "N/A",
//         phone_number: member.member_phone || "N/A",
//         membership_tier: member.membership_tier
//           ? member.membership_tier.membership_tier_name
//           : "N/A",
//         membership_status: member.membership_status || "Unknown",
//         points_balance: member.point || 0,
//         referral_count: member.referral_count || 0,
//         order_count: member.order_count || 0,
//       }));

//       setWatiTemplates(watiTemplateList);
//       setModalMembers(formattedData);
//       setModalTotalItems(total);

//       // Update membership tier options for filters if needed
//       // ...
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//       message.error("Failed to fetch members.");
//     } finally {
//       setLoadingModalMembers(false);
//     }
//   };

//   const handleFilterApply = (values: any) => {
//     setModalMemberFilters(values);
//     setIsFilterModalVisible(false);
//     fetchModalMembers({
//       page: 1,
//       pageSize: memberPageSize,
//       filters: values,
//       modalMemberSearchText: modalMemberSearchText,
//     });
//   };

//   // Fetch WATI templates and members when modal opens
//   useEffect(() => {

//     fetchModalMembers({
//       page: memberCurrentPage,
//       pageSize: memberPageSize,
//       filters: modalMemberFilters,
//       modalMemberSearchText: modalMemberSearchText,
//     });

//   }, []);


//   const handleWatiTemplateChange = async (templateId: string) => {
//     setLoadingTemplateData(true);
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/broadcast_setting/get_wati_template_detail/${templateId}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch template details: ${response.status}`);
//       }

//       const data = await response.json();
//       setSelectedTemplateData(data);

//       // Optionally, update form fields with the fetched data
//       broadcastForm.setFieldsValue({
//         // Example: Assuming the fetched data has a 'description' field
//         description: data.description || '',
//         // Add other fields as needed
//       });

//       message.success('Template details loaded successfully!');
//     } catch (error: any) {
//       console.error('Error fetching template details:', error);
//       message.error(`Error fetching template details: ${error.message}`);
//     } finally {
//       setLoadingTemplateData(false);
//     }
//   };



//   const onModalMemberSearch = (value: string) => {
//     const trimmedValue = value.trim().toLowerCase();
//     setModalMemberSearchText(trimmedValue);

//     // Reset pagination to the first page when a new search is performed
//     setModalCurrentPage(1);

//     fetchModalMembers({
//       page: 1,
//       pageSize: memberPageSize,
//       filters: modalMemberFilters,
//       modalMemberSearchText: trimmedValue,
//     });
//   };

//   // Define the rowSelection object
//   const memberRowSelection: TableProps<Member>['rowSelection'] = {
//     selectedRowKeys: selectedMemberRowKeys,
//     onChange: (selectedRowKeys: React.Key[]) => {
//       const keysAsString = selectedRowKeys.map((key) => key.toString());
//       setSelectedMemberRowKeys(keysAsString);
//       console.log('Selected members:', keysAsString);
//     },
//     preserveSelectedRowKeys: true, // Add this property
//   };

//   const handleModalMembersTableChange = (
//     pagination: any,
//     filters: any,
//     sorter: any
//   ) => {
//     setModalCurrentPage(pagination.current);
//     setModalPageSize(pagination.pageSize);
//     setModalMemberFilters(filters);

//     // Prepare sort parameters
//     let sortField = sorter.field;
//     let sortOrder = sorter.order;
//     if (sortOrder) {
//       sortOrder = sorter.order === "ascend" ? "ascend" : "descend";
//     }

//     // Fetch data based on the new pagination, filters, and sorting
//     fetchModalMembers({
//       page: pagination.current,
//       pageSize: pagination.pageSize,
//       sortField: sortField,
//       sortOrder: sortOrder,
//       filters: filters,
//       modalMemberSearchText: modalMemberSearchText,
//     });
//   };






//   const memberColumns: TableColumnsType<Member> = [
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
//       title: "Membership Tier",
//       dataIndex: "membership_tier",
//       key: "membership_tier",
//     },
//     {
//       title: "Membership Status",
//       dataIndex: "membership_status",
//       key: "membership_status",
//     },
//     {
//       title: "Points Balance",
//       dataIndex: "points_balance",
//       key: "points_balance",
//       sorter: (a, b) => a.points_balance - b.points_balance,
//     },
//     {
//       title: "Referral Count",
//       dataIndex: "referral_count",
//       key: "referral_count",
//       sorter: (a, b) => a.referral_count - b.referral_count,
//     },
//     {
//       title: "Order Count",
//       dataIndex: "order_count",
//       key: "order_count",
//       sorter: (a, b) => a.order_count - b.order_count,
//     },
//   ];


//   return (
//     <div>


//       <Form
//         form={broadcastForm}
//         layout="vertical"
//         onFinish={handleEditBroadcast}
//       >
//         {/* Broadcast Name */}
//         <Form.Item
//           label="Broadcast Name"
//           name="broadcast_name"
//           rules={[
//             { required: true, message: "Please input the broadcast name!" },
//           ]}
//         >
//           <Input />
//         </Form.Item>

//         {/* Template Message Selection */}
//         <Form.Item
//           name="wati_template"
//           label="WATI Template"
//           rules={[{ required: true, message: 'Please select a WATI template' }]}
//         >
//           <Select
//             loading={loadingTemplates}
//             onChange={handleWatiTemplateChange} // Add this line
//             placeholder="Select a WATI Template"
//           >
//             {watiTemplates.map((template) => (
//               <Select.Option key={template.id} value={template.id}>
//                 {template.name}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         {/* Schedule Type */}
//         <Form.Item
//           label="Schedule Type"
//           name="schedule_type"
//           rules={[
//             { required: true, message: "Please select a schedule type!" },
//           ]}
//         >
//           <Radio.Group>
//             <Radio value="now">Send Now</Radio>
//             <Radio value="later">Schedule for Later</Radio>
//           </Radio.Group>
//         </Form.Item>

//         {/* Conditional Scheduled Time */}
//         <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.schedule_type !== currentValues.schedule_type}>
//           {({ getFieldValue }) => {
//             return getFieldValue('schedule_type') === 'later' ? (
//               <Form.Item
//                 label="Scheduled Time"
//                 name="scheduled_time"
//                 rules={[{ required: true, message: 'Please select a scheduled time!' }]}
//               >
//                 <DatePicker
//                   showTime
//                   format="YYYY-MM-DD HH:mm"
//                   style={{ width: '100%' }}
//                   disabledDate={(current) =>
//                     current && dayjs(current).isBefore(dayjs().startOf('day'))
//                   }
//                 />
//               </Form.Item>
//             ) : null;
//           }}
//         </Form.Item>

//         {/* Member Selection */}
//         <Form.Item label="Member Selection" required>
//           <Space style={{ marginBottom: 16 }}>
//             <Input.Search
//               placeholder="Search members"
//               value={modalMemberSearchText}
//               onChange={(e) => setModalMemberSearchText(e.target.value)}
//               onSearch={(value, event) => {
//                 event?.preventDefault(); // Prevent form submission
//                 onModalMemberSearch(value);
//               }}
//               enterButton={<Button type="primary" htmlType="button">Search</Button>}
//               style={{ width: 300 }}
//               onPressEnter={(e) => {
//                 e.preventDefault(); // Prevent form submission on Enter key press
//                 onModalMemberSearch(modalMemberSearchText);
//               }}
//             />
//             <Button onClick={() => setIsFilterModalVisible(true)}>
//               Filters
//             </Button>
//             {selectedMemberRowKeys.length > 0 && (
//               <Badge count={selectedMemberRowKeys.length} overflowCount={999} />
//             )}
//             {selectedMemberRowKeys.length > 0 && (
//               <Tag color="blue">
//                 {selectedMemberRowKeys.length} Selected
//               </Tag>
//             )}


//           </Space>

//           <Table
//             dataSource={modalMembers}
//             columns={memberColumns}
//             rowKey="id"
//             rowSelection={memberRowSelection}
//             loading={loadingModalMembers}
//             pagination={{
//               current: memberCurrentPage,
//               pageSize: memberPageSize,
//               total: memberTotalItems,
//               showTotal: (total) => `Total ${total} items`,
//               showSizeChanger: true,
//               showQuickJumper: true,
//               position: ["bottomRight"],
//             }}
//             onChange={handleModalMembersTableChange}
//           // ... other props
//           />
//         </Form.Item>

//         {/* Submit Button */}
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             update Broadcast
//           </Button>
//         </Form.Item>
//       </Form>

//       <Modal
//         title="Filter Members"
//         open={isFilterModalVisible}
//         onCancel={() => setIsFilterModalVisible(false)}
//         footer={null}
//       >
//         <Form form={filterForm} layout="vertical" onFinish={handleFilterApply}>
//           {/* Membership Tier Filter */}
//           <Form.Item name="membership_tier" label="會員級別">
//             <Select
//               allowClear
//               placeholder="Select Membership Tier"
//               options={membershipTierOptions}
//             />
//           </Form.Item>
//           {/* Membership Status Filter */}
//           <Form.Item name="membership_status" label="Membership Status">
//             <Select
//               allowClear
//               placeholder="Select Membership Status"
//               options={[
//                 { value: "active", label: "Active" },
//                 { value: "expired", label: "Expired" },
//                 { value: "suspended", label: "Suspended" },
//               ]}
//             />
//           </Form.Item>

//           <Form.Item
//             name="membership_expiry_date"
//             label="會籍到期月份"
//             rules={[{ required: false, message: '選擇日期' }]}
//           >
//             <DatePicker
//               picker="month"
//               format="YYYY-MM"
//               style={{ width: '100%' }} />
//           </Form.Item>

//           <Form.Item
//             name="birthday"
//             label="生日月份"
//             rules={[{ required: false, message: '選擇日期' }]}
//           >
//             <DatePicker
//               picker="month"
//               format="MM"
//               style={{ width: '100%' }} />
//           </Form.Item>

//           <Form.Item
//             name="created_at"
//             label="加入日期"
//             rules={[{ required: false, message: '選擇日期' }]}
//           >
//             <DatePicker
//               // showTime
//               format="YYYY-MM-DD"
//               style={{ width: '100%' }} />
//           </Form.Item>

//           {/* Points Balance Filter */}
//           {/* <Form.Item name="points_balance" label="Points Balance">
//             <InputNumber
//               min={0}
//               placeholder="Minimum Points Balance"
//               style={{ width: "100%" }}
//             />
//           </Form.Item> */}
//           {/* Referral Count Filter */}
//           {/* <Form.Item name="referral_count" label="Count of Referrals">
//             <InputNumber
//               min={0}
//               placeholder="Minimum Referrals"
//               style={{ width: "100%" }}
//             />
//           </Form.Item> */}
//           {/* Order Count Filter */}
//           {/* <Form.Item name="order_count" label="Count of Orders">
//             <InputNumber
//               min={0}
//               placeholder="Minimum Orders"
//               style={{ width: "100%" }}
//             />
//           </Form.Item> */}
//           {/* Apply and Clear Buttons */}

//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               Apply Filters
//             </Button>
//             <Button
//               style={{ marginLeft: 8 }}
//               onClick={() => {
//                 filterForm.resetFields();
//               }}
//             >
//               Reset
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//     </div>
//   );


// };

// export default BroadcastDetailPage;
