// 完成基本 redemption setting

// 想處理 post request，後來可以 get data 顯示返

// // src/app/dashboard/app_setting/gift_setting/page.tsx

// 'use client';

// import React, { useState } from 'react';
// import {
//     Button,
//     Form,
//     InputNumber,
//     Typography,
//     Checkbox,
//     Divider,
//     message,
//     Space,
//     Card,
// } from 'antd';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

// const { Title } = Typography;


// const GetGiftSettingPage: React.FC = () => {
//     // Constants for maximum coupon types allowed
//     const MAX_FIXED_AMOUNT_COUPONS = 3;
//     const MAX_PERCENTAGE_DISCOUNT_COUPONS = 3;

//     // State variables for activation checkboxes
//     const [fixedAmountActive, setFixedAmountActive] = useState<boolean>(false);
//     const [percentageDiscountActive, setPercentageDiscountActive] = useState<boolean>(false);

//     const [form] = Form.useForm();

//     const onFinish = async (values: any) => {
//         console.log('Form Values:', values);

//         // Handle form submission logic here
//         // You can send the data to your backend API

//         try {
//             // Simulate API call
//             // Replace with your actual API call
//             await new Promise((resolve) => setTimeout(resolve, 1000));
//             message.success('Settings saved successfully!');
//         } catch (error: any) {
//             message.error('Failed to save settings!');
//         }
//     };

//     return (
//         <Form form={form} onFinish={onFinish} layout="vertical">
//             <div style={{ display: 'flex', justifyContent: 'center' }}>
//                 <Title level={2}>積分禮遇換領設定</Title>
//             </div>

//             {/* Fixed Amount Coupons Section */}
//             <Card
//                 title={
//                     <Space>
//                         <Checkbox
//                             checked={fixedAmountActive}
//                             onChange={(e) => setFixedAmountActive(e.target.checked)}
//                         >
//                             固定金額券
//                         </Checkbox>
//                         <span style={{ fontSize: '14px', color: '#888' }}>
//                             （商戶可設定金額、所需積分、最低消費金額、有效期）
//                         </span>
//                     </Space>
//                 }
//                 style={{ marginBottom: 24 }}
//             >
//                 {fixedAmountActive ? (
//                     <>
//                         <Form.List name="fixedAmountCoupons">
//                             {(fields, { add, remove }) => (
//                                 <>
//                                     {fields.map((field, index) => (
//                                         <div
//                                             key={field.key}
//                                             style={{
//                                                 border: '1px solid #d9d9d9',
//                                                 padding: '16px',
//                                                 marginBottom: '16px',
//                                                 position: 'relative',
//                                             }}
//                                         >
//                                             <Title level={4}>固定金額券 {index + 1}</Title>

//                                             {fields.length > 1 && (
//                                                 <Button
//                                                     type="text"
//                                                     onClick={() => remove(field.name)}
//                                                     style={{ position: 'absolute', top: 8, right: 8 }}
//                                                     icon={<MinusCircleOutlined />}
//                                                 />
//                                             )}

//                                             <Form.Item
//                                                 label={`金額 (券 ${index + 1})`}
//                                                 name={[field.name, 'amount']}
//                                                 rules={[{ required: true, message: '請輸入金額' }]}
//                                             >
//                                                 <InputNumber min={1} style={{ width: '100%' }} />
//                                             </Form.Item>
//                                             <Form.Item
//                                                 label={`所需積分`}
//                                                 name={[field.name, 'point']}
//                                                 rules={[{ required: true, message: '請輸入所需積分' }]}
//                                             >
//                                                 <InputNumber min={1} style={{ width: '100%' }} />
//                                             </Form.Item>
//                                             <Form.Item
//                                                 label="最低消費金額"
//                                                 name={[field.name, 'min_spend']}
//                                                 rules={[{ required: true, message: '請輸入最低消費金額' }]}
//                                             >
//                                                 <InputNumber min={0} style={{ width: '100%' }} />
//                                             </Form.Item>
//                                             <Form.Item
//                                                 label="有效期（月）"
//                                                 name={[field.name, 'validity_period']}
//                                                 rules={[{ required: true, message: '請輸入有效期（月）' }]}
//                                             >
//                                                 <InputNumber min={1} style={{ width: '100%' }} />
//                                             </Form.Item>
//                                         </div>
//                                     ))}
//                                     {fields.length < MAX_FIXED_AMOUNT_COUPONS && (
//                                         <Form.Item>
//                                             <Button
//                                                 type="dashed"
//                                                 onClick={() => add()}
//                                                 block
//                                                 icon={<PlusOutlined />}
//                                             >
//                                                 新增固定金額券
//                                             </Button>
//                                         </Form.Item>
//                                     )}
//                                 </>
//                             )}
//                         </Form.List>
//                     </>
//                 ) : (
//                     <p style={{ color: '#888' }}>未啟用固定金額券。</p>
//                 )}
//             </Card>

//             {/* Percentage Discount Coupons Section */}
//             <Card
//                 title={
//                     <Space>
//                         <Checkbox
//                             checked={percentageDiscountActive}
//                             onChange={(e) => setPercentageDiscountActive(e.target.checked)}
//                         >
//                             折扣比率券
//                         </Checkbox>
//                         <span style={{ fontSize: '14px', color: '#888' }}>
//                             （商戶可設定折扣比率、所需積分、最低消費金額、有效期）
//                         </span>
//                     </Space>
//                 }
//             >
//                 {percentageDiscountActive ? (
//                     <>
//                         <Form.List name="percentageDiscountCoupons">
//                             {(fields, { add, remove }) => (
//                                 <>
//                                     {fields.map((field, index) => (
//                                         <div
//                                             key={field.key}
//                                             style={{
//                                                 border: '1px solid #d9d9d9',
//                                                 padding: '16px',
//                                                 marginBottom: '16px',
//                                                 position: 'relative',
//                                             }}
//                                         >
//                                             <Title level={4}>折扣比率券 {index + 1}</Title>

//                                             {fields.length > 1 && (
//                                                 <Button
//                                                     type="text"
//                                                     onClick={() => remove(field.name)}
//                                                     style={{ position: 'absolute', top: 8, right: 8 }}
//                                                     icon={<MinusCircleOutlined />}
//                                                 />
//                                             )}

//                                             <Form.Item
//                                                 label={`折扣比率 (%) (券 ${index + 1})`}
//                                                 name={[field.name, 'discount_rate']}
//                                                 rules={[{ required: true, message: '請輸入折扣比率' }]}
//                                             >
//                                                 <InputNumber
//                                                     min={1}
//                                                     max={100}
//                                                     style={{ width: '100%' }}
//                                                     formatter={(value) => `${value}%`}
//                                                     parser={(value) => value!.replace('%', '')}
//                                                 />
//                                             </Form.Item>
//                                             <Form.Item
//                                                 label={`所需積分`}
//                                                 name={[field.name, 'point']}
//                                                 rules={[{ required: true, message: '請輸入所需積分' }]}
//                                             >
//                                                 <InputNumber min={1} style={{ width: '100%' }} />
//                                             </Form.Item>
//                                             <Form.Item
//                                                 label="最低消費金額"
//                                                 name={[field.name, 'min_spend']}
//                                                 rules={[{ required: true, message: '請輸入最低消費金額' }]}
//                                             >
//                                                 <InputNumber min={0} style={{ width: '100%' }} />
//                                             </Form.Item>
//                                             <Form.Item
//                                                 label="有效期（月）"
//                                                 name={[field.name, 'validity_period']}
//                                                 rules={[{ required: true, message: '請輸入有效期（月）' }]}
//                                             >
//                                                 <InputNumber min={1} style={{ width: '100%' }} />
//                                             </Form.Item>
//                                         </div>
//                                     ))}
//                                     {fields.length < MAX_PERCENTAGE_DISCOUNT_COUPONS && (
//                                         <Form.Item>
//                                             <Button
//                                                 type="dashed"
//                                                 onClick={() => add()}
//                                                 block
//                                                 icon={<PlusOutlined />}
//                                             >
//                                                 新增折扣比率券
//                                             </Button>
//                                         </Form.Item>
//                                     )}
//                                 </>
//                             )}
//                         </Form.List>
//                     </>
//                 ) : (
//                     <p style={{ color: '#888' }}>未啟用折扣比率券。</p>
//                 )}
//             </Card>

//             {/* Submit Button */}
//             <Form.Item style={{ marginTop: 24 }}>
//                 <Button type="primary" htmlType="submit">
//                     保存設置
//                 </Button>
//             </Form.Item>
//         </Form>
//     );
// };

// export default GetGiftSettingPage;