// 完成 post and get data, 但發現顯示上不能持續。

// 想將 變成 table list view，再新增，activate or inactivate

// // src/app/dashboard/app_setting/gift_setting/page.tsx

// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   Form,
//   InputNumber,
//   Typography,
//   Checkbox,
//   message,
//   Space,
//   Card,
//   Spin,
//   Alert,
//   Input,
// } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// const { Title } = Typography;

// const GetGiftSettingPage: React.FC = () => {
//   // Constants for maximum coupon types allowed
//   const MAX_FIXED_AMOUNT_COUPONS = 3;
//   const MAX_PERCENTAGE_DISCOUNT_COUPONS = 3;

//   // State variables for activation checkboxes
//   const [fixedAmountActive, setFixedAmountActive] = useState<boolean>(false);
//   const [percentageDiscountActive, setPercentageDiscountActive] = useState<boolean>(false);

//   const [form] = Form.useForm();

//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/gift_setting/get_gift_setting', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
  
//         if (response.status === 404) {
//           // No settings found, initialize with default values
//           setFixedAmountActive(false);
//           setPercentageDiscountActive(false);
//           form.setFieldsValue({
//             fixedAmountCoupons: [],
//             percentageDiscountCoupons: [],
//           });
//         } else if (!response.ok) {
//           throw new Error(`Failed to fetch settings: ${response.status}`);
//         } else {
//           const data = await response.json();
  
//           // Update activation states
//           setFixedAmountActive(data.fixedAmountActive);
//           setPercentageDiscountActive(data.percentageDiscountActive);
  
//           // Set form fields
//           form.setFieldsValue({
//             fixedAmountCoupons: data.fixedAmountCoupons,
//             percentageDiscountCoupons: data.percentageDiscountCoupons,
//           });
//         }
//       } catch (error: any) {
//         console.error('Error fetching settings:', error);
//         setError(error.message);
//         message.error(`Error fetching settings: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchSettings();
//   }, [form]);

//   const onFinish = async (values: any) => {
//     // Prepare the data to send to the backend
//     const settings = {
//       fixedAmountActive,
//       percentageDiscountActive,
//       fixedAmountCoupons: values.fixedAmountCoupons || [],
//       percentageDiscountCoupons: values.percentageDiscountCoupons || [],
//     };

//     console.log('Settings to save:', settings);

//     try {
//       const response = await fetch('http://localhost:3000/gift_setting/post_gift_setting', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(settings),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to save settings: ${response.status}`);
//       }

//       const result = await response.json();
//       message.success('Settings saved successfully!');
//     } catch (error: any) {
//       console.error('Error saving settings:', error);
//       message.error(`Failed to save settings: ${error.message}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ textAlign: 'center', padding: '50px' }}>
//         <Spin tip="Loading..." size="large" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ textAlign: 'center', padding: '50px' }}>
//         <Alert message="Error" description={error} type="error" showIcon />
//       </div>
//     );
//   }

//   return (
//     <Form form={form} onFinish={onFinish} layout="vertical">
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <Title level={2}>積分禮遇換領設定</Title>
//       </div>

//       {/* Fixed Amount Coupons Section */}
//       <Card
//         title={
//           <Space>
//             <Checkbox
//               checked={fixedAmountActive}
//               onChange={(e) => setFixedAmountActive(e.target.checked)}
//             >
//               固定金額券
//             </Checkbox>
//             <span style={{ fontSize: '14px', color: '#888' }}>
//               （商戶可設定金額、所需積分、最低消費金額、有效期）
//             </span>
//           </Space>
//         }
//         style={{ marginBottom: 24 }}
//       >
//         {fixedAmountActive ? (
//           <>
//             <Form.List name="fixedAmountCoupons">
//               {(fields, { add, remove }) => (
//                 <>
//                   {fields.map((field, index) => (
//                     <div
//                       key={field.key}
//                       style={{
//                         border: '1px solid #d9d9d9',
//                         padding: '16px',
//                         marginBottom: '16px',
//                         position: 'relative',
//                       }}
//                     >
//                       <Title level={4}>固定金額券 {index + 1}</Title>

//                       {fields.length > 1 && (
//                         <Button
//                           type="text"
//                           onClick={() => remove(field.name)}
//                           style={{ position: 'absolute', top: 8, right: 8 }}
//                           icon={<MinusCircleOutlined />}
//                         />
//                       )}

//                       {/* Hidden ID field */}
//                       <Form.Item name={[field.name, 'id']} hidden>
//                         <InputNumber />
//                       </Form.Item>

//                       <Form.Item
//                         label={`金額 (券 ${index + 1})`}
//                         name={[field.name, 'amount']}
//                         rules={[{ required: true, message: '請輸入金額' }]}
//                       >
//                         <InputNumber min={1} style={{ width: '100%' }} />
//                       </Form.Item>
//                       <Form.Item
//                         label={`所需積分`}
//                         name={[field.name, 'point']}
//                         rules={[{ required: true, message: '請輸入所需積分' }]}
//                       >
//                         <InputNumber min={1} style={{ width: '100%' }} />
//                       </Form.Item>
//                       <Form.Item
//                         label="最低消費金額"
//                         name={[field.name, 'min_spend']}
//                         rules={[{ required: true, message: '請輸入最低消費金額' }]}
//                       >
//                         <InputNumber min={0} style={{ width: '100%' }} />
//                       </Form.Item>
//                       <Form.Item
//                         label="有效期（月）"
//                         name={[field.name, 'validity_period']}
//                         rules={[{ required: true, message: '請輸入有效期（月）' }]}
//                       >
//                         <InputNumber min={1} style={{ width: '100%' }} />
//                       </Form.Item>
//                     </div>
//                   ))}
//                   {fields.length < MAX_FIXED_AMOUNT_COUPONS && (
//                     <Form.Item>
//                       <Button
//                         type="dashed"
//                         onClick={() => add()}
//                         block
//                         icon={<PlusOutlined />}
//                       >
//                         新增固定金額券
//                       </Button>
//                     </Form.Item>
//                   )}
//                 </>
//               )}
//             </Form.List>
//           </>
//         ) : (
//           <p style={{ color: '#888' }}>未啟用固定金額券。</p>
//         )}
//       </Card>

//       {/* Percentage Discount Coupons Section */}
//       <Card
//         title={
//           <Space>
//             <Checkbox
//               checked={percentageDiscountActive}
//               onChange={(e) => setPercentageDiscountActive(e.target.checked)}
//             >
//               折扣比率券
//             </Checkbox>
//             <span style={{ fontSize: '14px', color: '#888' }}>
//               （商戶可設定折扣比率、所需積分、最低消費金額、有效期）
//             </span>
//           </Space>
//         }
//       >
//         {percentageDiscountActive ? (
//           <>
//             <Form.List name="percentageDiscountCoupons">
//               {(fields, { add, remove }) => (
//                 <>
//                   {fields.map((field, index) => (
//                     <div
//                       key={field.key}
//                       style={{
//                         border: '1px solid #d9d9d9',
//                         padding: '16px',
//                         marginBottom: '16px',
//                         position: 'relative',
//                       }}
//                     >
//                       <Title level={4}>折扣比率券 {index + 1}</Title>

//                       {fields.length > 1 && (
//                         <Button
//                           type="text"
//                           onClick={() => remove(field.name)}
//                           style={{ position: 'absolute', top: 8, right: 8 }}
//                           icon={<MinusCircleOutlined />}
//                         />
//                       )}

//                       {/* Hidden ID field */}
//                       <Form.Item name={[field.name, 'id']} hidden>
//                         <InputNumber />
//                       </Form.Item>

//                       <Form.Item
//                         label={`折扣比率 (%) (券 ${index + 1})`}
//                         name={[field.name, 'discount_rate']}
//                         rules={[{ required: true, message: '請輸入折扣比率' }]}
//                       >
//                         <InputNumber
//                           min={1}
//                           max={100}
//                           style={{ width: '100%' }}
//                           formatter={(value) => `${value}%`}
//                           parser={(value) => value!.replace('%', '')}
//                         />
//                       </Form.Item>
//                       <Form.Item
//                         label={`所需積分`}
//                         name={[field.name, 'point']}
//                         rules={[{ required: true, message: '請輸入所需積分' }]}
//                       >
//                         <InputNumber min={1} style={{ width: '100%' }} />
//                       </Form.Item>
//                       <Form.Item
//                         label="最低消費金額"
//                         name={[field.name, 'min_spend']}
//                         rules={[{ required: true, message: '請輸入最低消費金額' }]}
//                       >
//                         <InputNumber min={0} style={{ width: '100%' }} />
//                       </Form.Item>
//                       <Form.Item
//                         label="有效期（月）"
//                         name={[field.name, 'validity_period']}
//                         rules={[{ required: true, message: '請輸入有效期（月）' }]}
//                       >
//                         <InputNumber min={1} style={{ width: '100%' }} />
//                       </Form.Item>
//                     </div>
//                   ))}
//                   {fields.length < MAX_PERCENTAGE_DISCOUNT_COUPONS && (
//                     <Form.Item>
//                       <Button
//                         type="dashed"
//                         onClick={() => add()}
//                         block
//                         icon={<PlusOutlined />}
//                       >
//                         新增折扣比率券
//                       </Button>
//                     </Form.Item>
//                   )}
//                 </>
//               )}
//             </Form.List>
//           </>
//         ) : (
//           <p style={{ color: '#888' }}>未啟用折扣比率券。</p>
//         )}
//       </Card>

//       {/* Submit Button */}
//       <Form.Item style={{ marginTop: 24 }}>
//         <Button type="primary" htmlType="submit">
//           保存設置
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default GetGiftSettingPage;