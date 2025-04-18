// 完成 Membership tier 設定，加入 Membership basic 設定

// 想將 membership tier 變成 固定 4 級


// // src/app/dashboard/discount_code_list/membership_tier/page.tsx

// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import {
//   Button,
//   Form,
//   Input,
//   InputNumber,
//   Typography,
//   message,
//   Select
// } from 'antd';
// import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
// import { purple } from '@ant-design/colors';

// const { Title } = Typography;

// interface MembershipTier {
//   membership_tier_name: string;
//   require_point: number;
//   extend_membership_point: number;
//   point_multiplier: number;
//   membership_period: number;
// }

// interface MembershipTierFormValues {
//   membershipTiers: MembershipTier[];
// }



// interface Form1Values {
//   admin_setting_id: number;
//   membership_period: string; // Assuming the value is a string as per Select options
//   membership_extend_method: string;
//   membership_end_result: string;
// }

// const membership_period = [
//   { value: '1', label: '1' },
//   { value: '2', label: '2' },
//   { value: '3', label: '3' },
//   { value: '4', label: '4' },
//   { value: '5', label: '5' },
// ];

// const membership_extend_method = [
//   { value: '1', label: '購物滿一定金額，開啟續會按鈕。' },
//   { value: '2', label: '只需詢問顧客意願，無條件續會。' },
// ];

// const membership_end_result = [
//   { value: '1', label: '會員期結束，會員擁有的積分及禮遇會失效' },
//   { value: '2', label: '會員期結束，會員擁有的積分及禮遇不會失效，續會後可繼續使用。' },
// ];



// const MAX_TIERS = 3;
// const MIN_TIERS = 3;

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 6 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 18 },
//   },
// };

// const GetMembershipTierPage: React.FC = () => {
//   const [form] = Form.useForm<MembershipTierFormValues>();
//   const [form1] = Form.useForm();

//   // State variables
//   const [initialTiers, setInitialTiers] = useState<MembershipTier[]>([]);
//   const [loading, setLoading] = useState<boolean>(true); // To handle loading state
//   const hasFetched = useRef(false);


//   const onFinishForm1 = async (values: Form1Values) => {
//     // Include admin_setting_id in the data
//     const dataToSend = {
//       admin_setting_id: 1,
//       membership_period: values.membership_period,
//       membership_extend_method: values.membership_extend_method,
//       membership_end_result: values.membership_end_result,
//     };

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_setting/post_admin_setting`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(dataToSend),
//       });

//       if (!response.ok) {
//         throw new Error(`Server error! status: ${response.status}`);
//       }

//       const responseData = await response.json();
//       console.log('Server Response:', responseData);
//       // Optionally, display a success message or perform other actions
//       message.success('Settings updated successfully!');
//     } catch (error: any) {
//       console.error('Error submitting form:', error);
//       // Optionally, display an error message
//       message.error(`Failed to update settings: ${error.message}`);
//     }
//   };


//   // Fetch current membership tiers when component mounts
//   useEffect(() => {

//     if (hasFetched.current) {
//       // If fetch has already been called, do not proceed
//       return;
//     }

//     hasFetched.current = true; // Mark that fetch has been called

//     const fetchTiers = async () => {
//       try {

//         // console.log('fetchTier try begin');

//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership_tier/get_membership_tier_setting`, {
//           method: 'GET', // Ensure you're using the correct method
//         });
//         // console.log('fetchTier try fetch finish: ', response);

//         if (!response.ok) {
//           // console.log('try if error');
//           throw new Error(`Failed to fetch membership tiers: ${response.status}`);

//         }

//         // console.log('fetchTier try if finish');
//         // console.log('fetchTier try parsing to json beign');

//         const data: MembershipTier[] = await response.json();
//         console.log('Fetched current membership tiers:', data);

//         // console.log('fetchTier try parsing to json finish');

//         // Ensure data has at least MIN_TIERS entries
//         let tiers = data;
//         while (tiers.length < MIN_TIERS) {
//           tiers.push({
//             membership_tier_name: `Level ${tiers.length + 1}`,
//             require_point: 0,
//             extend_membership_point: 0,
//             point_multiplier: 1.0,
//             membership_period: 12,
//           });
//         }

//         setInitialTiers(tiers);
//       } catch (error: any) {
//         console.error('Error fetching membership tiers:', error);
//         message.error('Failed to fetch membership tiers');
//         console.log('catch error');
//         // You may want to initialize with default tiers if fetching fails
//         let tiers: MembershipTier[] = [];
//         while (tiers.length < MIN_TIERS) {
//           tiers.push({
//             membership_tier_name: `Level ${tiers.length + 1}`,
//             require_point: 0,
//             extend_membership_point: 0,
//             point_multiplier: 1.0,
//             membership_period: 12,
//           });
//         }
//         setInitialTiers(tiers);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTiers();
//   }, []);

//   // Update form fields when initial tiers are set
//   useEffect(() => {
//     if (!loading) {
//       form.setFieldsValue({ membershipTiers: initialTiers });
//     }
//   }, [loading, initialTiers, form]);

//   const onFinish = async (values: MembershipTierFormValues) => {
//     if (values.membershipTiers.length < MIN_TIERS) {
//       message.error(`最少需要 ${MIN_TIERS} 個會員層級。`);
//       return;
//     }

//     if (values.membershipTiers.length > MAX_TIERS) {
//       message.error(`最多只能 ${MAX_TIERS} 個會員層級。`);
//       return;
//     }

//     const updatedMembershipTiers = values.membershipTiers.map((tier, index) => ({
//       ...tier,
//       membership_tier_sequence: index + 1, // Assign sequence number
//       point_multiplier: tier.point_multiplier * 1000,
//     }));

//     console.log('Form Submitted Successfully:', updatedMembershipTiers);

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership_tier/post_membership_tier_setting`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           // 'auth': '12345'
//         },
//         body: JSON.stringify(updatedMembershipTiers),
//       });

//       if (!response.ok) {
//         throw new Error(`Server error! status: ${response.status}`);
//       }

//       const responseData = await response.json();
//       console.log('Server Response:', responseData);
//       message.success('Membership tiers updated successfully!');
//     } catch (error: any) {
//       console.error('Error submitting form:', error);
//       message.error(`Failed to update membership tiers: ${error.message}`);
//     }
//   };

//   const onFinishFailed = (errorInfo: any) => {
//     console.log('Form Submission Failed:', errorInfo);
//     message.error('Please check the form for errors and try again.');
//   };

//   // Handle loading state
//   if (loading) {
//     return (
//       <div style={{ textAlign: 'center', padding: '50px' }}>
//         <Title level={3}>Loading membership tiers...</Title>
//       </div>
//     );
//   }

//   return (

//     <>

//       <Form
//         form={form1}
//         onFinish={onFinishForm1}
//         layout="horizontal"
//         labelCol={{ span: 6 }}
//         wrapperCol={{ span: 14 }}
//       >
//         <div style={{ display: 'flex', justifyContent: 'center' }}>
//           <Title level={2} style={{ backgroundColor: purple[1], padding: '1rem' }}>
//             會員基本設定
//           </Title>
//         </div>

//         <Form.Item
//           label="會員有效年期"
//           name="membership_period"
//           rules={[{ required: true, message: '請選擇會員有效年期' }]}
//         >
//           <Select
//             // defaultValue="1"
//             style={{ width: 600 }}
//             // allowClear
//             options={membership_period}
//             placeholder="選擇年數"
//           />
//         </Form.Item>

//         <Form.Item
//           label="續會方式"
//           name="membership_extend_method"
//           rules={[{ required: true, message: '請選擇續會方式' }]}
//         >
//           <Select
//             // defaultValue="2"
//             style={{ width: 600 }}
//             // allowClear
//             options={membership_extend_method}
//             placeholder="選擇續會方式"
//           />
//         </Form.Item>

//         <Form.Item
//           label="會員期結束的處理"
//           name="membership_end_result"
//           rules={[{ required: true, message: '請選擇會員期結束的處理' }]}
//         >
//           <Select
//             // defaultValue="1"
//             style={{ width: 600 }}
//             // allowClear
//             options={membership_end_result}
//             placeholder="選擇續會方式"
//           />
//         </Form.Item>

//         <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </Form.Item>
//       </Form>

//       <Form
//         {...formItemLayout}
//         form={form}
//         name="member-tier-form"
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//         autoComplete="off"
//       >
//         <div style={{ display: 'flex', justifyContent: 'center' }}>
//           <Title
//             level={2}
//             style={{ backgroundColor: '#f0f2f5', padding: '1rem', borderRadius: '4px' }}
//           >
//             會員層級設定
//           </Title>
//         </div>

//         <Form.List name="membershipTiers">
//           {(fields, { add, remove }) => (
//             <>
//               {fields.map((field, index) => {
//                 const currentTier = initialTiers[index] || {};

//                 return (
//                   <div
//                     key={`membershipTier_${field.key}`} // Use field.key for the key
//                     style={{
//                       border: '1px solid #ccc',
//                       padding: '20px',
//                       marginBottom: '20px',
//                       borderRadius: '4px',
//                     }}
//                   >
//                     <Title level={4}>會員層級 {index + 1}</Title>

//                     {/* Display sequence number */}
//                     <Form.Item label="層級序號">
//                       <InputNumber value={index + 1} disabled />
//                     </Form.Item>

//                     <Form.Item
//                       label={
//                         <span>
//                           會員名稱 {' '}
//                         </span>
//                       }
//                       name={[field.name, 'membership_tier_name']}
//                       rules={[{ required: true, message: '請輸入會員名稱' }]}
//                       extra={`當前設定：${currentTier.membership_tier_name || '未設定'}`}
//                     >
//                       <Input placeholder="例如：Level 1" />

//                     </Form.Item>

//                     {/* Other form items */}
//                     <Form.Item
//                       label={
//                         <span>
//                           所需積分{' '}
//                         </span>
//                       }
//                       name={[field.name, 'require_point']}
//                       rules={[{ required: true, message: '請輸入所需積分' }]}
//                       extra={`當前設定：${currentTier.require_point || 0}`}
//                     >
//                       <InputNumber min={0} style={{ width: '100%' }} />
//                     </Form.Item>

//                     <Form.Item
//                       label={
//                         <span>
//                           續會一年所需積分{' '}
//                         </span>
//                       }
//                       name={[field.name, 'extend_membership_point']}
//                       rules={[{ required: true, message: '請輸入續會所需積分' }]}
//                       extra={`當前設定：${currentTier.extend_membership_point || 0}`}
//                     >
//                       <InputNumber min={0} style={{ width: '100%' }} />
//                     </Form.Item>

//                     <Form.Item
//                       label={
//                         <span>
//                           積分獲得倍數{' '}
//                         </span>
//                       }
//                       name={[field.name, 'point_multiplier']}
//                       rules={[{ required: true, message: '請輸入積分獲得倍數' }]}
//                       extra={`當前設定：${currentTier.point_multiplier || 0}`}

//                     >
//                       <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
//                     </Form.Item>

//                     <Form.Item
//                       label={
//                         <span>
//                           會員期限（月）{' '}
//                         </span>
//                       }
//                       name={[field.name, 'membership_period']}
//                       rules={[{ required: true, message: '請輸入會員期限（月）' }]}
//                       extra={`當前設定：${currentTier.membership_period || 0}`}
//                     >
//                       <InputNumber min={1} style={{ width: '100%' }} />
//                     </Form.Item>

//                     {/* Remove button */}
//                     {fields.length > MIN_TIERS && (
//                       <Button
//                         type="dashed"
//                         danger
//                         onClick={() => remove(field.name)}
//                         icon={<MinusCircleOutlined />}
//                         style={{ marginTop: '10px' }}
//                         disabled={fields.length <= MIN_TIERS}
//                       >
//                         移除此層級
//                       </Button>
//                     )}
//                   </div>
//                 );
//               })}

//               {/* Add button */}
//               <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//                 <Button
//                   type="dashed"
//                   onClick={() => add()}
//                   block
//                   icon={<PlusOutlined />}
//                   disabled={fields.length >= MAX_TIERS}
//                 >
//                   新增會員層級
//                 </Button>
//                 {fields.length >= MAX_TIERS && (
//                   <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
//                     已達到最大會員層級數 ({MAX_TIERS})
//                   </div>
//                 )}
//               </Form.Item>
//             </>
//           )}
//         </Form.List>

//         <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//           <Button type="primary" htmlType="submit">
//             提交
//           </Button>
//         </Form.Item>
//       </Form>
//     </>
//   );
// };

// export default GetMembershipTierPage;