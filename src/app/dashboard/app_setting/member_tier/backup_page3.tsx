// 完成：想將 form data structure 成 array 放回 frontend
// 完成：用了 Chatgpt suggest 的設定會員方式，可加可減，可設定最大最小會員層數

// 想將 database membership_tier_setting get 到 frontend 中顯示
// 想加入 useRef 令 double request 解決


// // src/app/dashboard/app_setting/member_tier/page.tsx

// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//   Button,
//   Form,
//   Input,
//   InputNumber,
//   Typography,
//   message,
// } from 'antd';
// import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

// const { Title } = Typography;

// interface MemberTier {
//   member_tier_name: string;
//   require_point: number;
//   extend_membership_point: number;
//   point_multiplier: number;
//   membership_period: number;
// }

// interface MemberTierFormValues {
//   memberTiers: MemberTier[];
// }

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

// const MemberTierComponent: React.FC = () => {
//   const [form] = Form.useForm<MemberTierFormValues>();

//   // State variables
//   const [initialTiers, setInitialTiers] = useState<MemberTier[]>([]);
//   const [loading, setLoading] = useState<boolean>(true); // To handle loading state

//   // Fetch current membership tiers when component mounts
//   useEffect(() => {
//     const fetchTiers = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/admin/membership_tier_setting', {
//           method: 'GET', // Ensure you're using the correct method
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch membership tiers: ${response.status}`);
//         }

//         const data: MemberTier[] = await response.json();
//         console.log('Fetched current membership tiers:', data);

//         // Ensure data has at least MIN_TIERS entries
//         let tiers = data;
//         while (tiers.length < MIN_TIERS) {
//           tiers.push({
//             member_tier_name: `Level ${tiers.length + 1}`,
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
//         // You may want to initialize with default tiers if fetching fails
//         let tiers: MemberTier[] = [];
//         while (tiers.length < MIN_TIERS) {
//           tiers.push({
//             member_tier_name: `Level ${tiers.length + 1}`,
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
//       form.setFieldsValue({ memberTiers: initialTiers });
//     }
//   }, [loading, initialTiers, form]);

//   const onFinish = async (values: MemberTierFormValues) => {
//     if (values.memberTiers.length < MIN_TIERS) {
//       message.error(`最少需要 ${MIN_TIERS} 個會員層級。`);
//       return;
//     }

//     if (values.memberTiers.length > MAX_TIERS) {
//       message.error(`最多只能 ${MAX_TIERS} 個會員層級。`);
//       return;
//     }

//     const updatedMemberTiers = values.memberTiers.map((tier, index) => ({
//       ...tier,
//       member_tier_sequence: index + 1, // Assign sequence number
//       point_multiplier: tier.point_multiplier * 1000,
//     }));

//     console.log('Form Submitted Successfully:', updatedMemberTiers);

//     try {
//       const response = await fetch('http://localhost:3000/admin/membership_tier', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedMemberTiers),
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
//     <Form
//       {...formItemLayout}
//       form={form}
//       name="member-tier-form"
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//       autoComplete="off"
//     >
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <Title
//           level={2}
//           style={{ backgroundColor: '#f0f2f5', padding: '1rem', borderRadius: '4px' }}
//         >
//           會員層級設定
//         </Title>
//       </div>

//       <Form.List name="memberTiers">
//         {(fields, { add, remove }) => (
//           <>
//             {fields.map((field, index) => {
//               const currentTier = initialTiers[index] || {};

//               return (
//                 <div
//                   key={`memberTier_${field.key}`} // Use field.key for the key
//                   style={{
//                     border: '1px solid #ccc',
//                     padding: '20px',
//                     marginBottom: '20px',
//                     borderRadius: '4px',
//                   }}
//                 >
//                   <Title level={4}>會員層級 {index + 1}</Title>

//                   {/* Display sequence number */}
//                   <Form.Item label="層級序號">
//                     <InputNumber value={index + 1} disabled />
//                   </Form.Item>

//                   <Form.Item
//                     label={
//                       <span>
//                         會員名稱{' '}
//                         <span style={{ color: 'gray' }}>
//                           （當前設定：{currentTier.member_tier_name || '未設定'}）
//                         </span>
//                       </span>
//                     }
//                     name={[field.name, 'member_tier_name']}
//                     rules={[{ required: true, message: '請輸入會員名稱' }]}
//                   >
//                     <Input placeholder="例如：Level 1" />
//                   </Form.Item>

//                   {/* Other form items */}
//                   <Form.Item
//                     label={
//                       <span>
//                         所需積分{' '}
//                         <span style={{ color: 'gray' }}>
//                           （當前設定：{currentTier.require_point || 0}）
//                         </span>
//                       </span>
//                     }
//                     name={[field.name, 'require_point']}
//                     rules={[{ required: true, message: '請輸入所需積分' }]}
//                   >
//                     <InputNumber min={0} style={{ width: '100%' }} />
//                   </Form.Item>

//                   <Form.Item
//                     label={
//                       <span>
//                         續會一年所需積分{' '}
//                         <span style={{ color: 'gray' }}>
//                           （當前設定：{currentTier.extend_membership_point || 0}）
//                         </span>
//                       </span>
//                     }
//                     name={[field.name, 'extend_membership_point']}
//                     rules={[{ required: true, message: '請輸入續會所需積分' }]}
//                   >
//                     <InputNumber min={0} style={{ width: '100%' }} />
//                   </Form.Item>

//                   <Form.Item
//                     label={
//                       <span>
//                         積分獲得倍數{' '}
//                         <span style={{ color: 'gray' }}>
//                           （當前設定：{currentTier.point_multiplier || 0}）
//                         </span>
//                       </span>
//                     }
//                     name={[field.name, 'point_multiplier']}
//                     rules={[{ required: true, message: '請輸入積分獲得倍數' }]}
//                   >
//                     <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
//                   </Form.Item>

//                   <Form.Item
//                     label={
//                       <span>
//                         會員期限（月）{' '}
//                         <span style={{ color: 'gray' }}>
//                           （當前設定：{currentTier.membership_period || 0}）
//                         </span>
//                       </span>
//                     }
//                     name={[field.name, 'membership_period']}
//                     rules={[{ required: true, message: '請輸入會員期限（月）' }]}
//                   >
//                     <InputNumber min={1} style={{ width: '100%' }} />
//                   </Form.Item>

//                   {/* Remove button */}
//                   {fields.length > MIN_TIERS && (
//                     <Button
//                       type="dashed"
//                       danger
//                       onClick={() => remove(field.name)}
//                       icon={<MinusCircleOutlined />}
//                       style={{ marginTop: '10px' }}
//                       disabled={fields.length <= MIN_TIERS}
//                     >
//                       移除此層級
//                     </Button>
//                   )}
//                 </div>
//               );
//             })}

//             {/* Add button */}
//             <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//               <Button
//                 type="dashed"
//                 onClick={() => add()}
//                 block
//                 icon={<PlusOutlined />}
//                 disabled={fields.length >= MAX_TIERS}
//               >
//                 新增會員層級
//               </Button>
//               {fields.length >= MAX_TIERS && (
//                 <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
//                   已達到最大會員層級數 ({MAX_TIERS})
//                 </div>
//               )}
//             </Form.Item>
//           </>
//         )}
//       </Form.List>

//       <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//         <Button type="primary" htmlType="submit">
//           提交
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default MemberTierComponent;