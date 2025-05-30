// 完成基本顯示，未做好 function 

// 想完成 停用啟用，Update redemption item


// // src/app/dashboard/app_setting/redemption_item/[redemption_item_id]/edit/page.tsx

// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//     Button,
//     Card,
//     Form,
//     Input,
//     InputNumber,
//     Select,
//     Typography,
//     message,
//     Spin,
//     Alert,
//     Descriptions,
//     DatePicker,
//     Modal,
//     Switch
// } from 'antd';
// import { useParams, useRouter } from 'next/navigation';
// import dayjs from 'dayjs';

// const { Title } = Typography;
// const { Option } = Select;
// const { RangePicker } = DatePicker;

// interface RedemptionItem {
//     redemption_item_id: number;
//     redemption_item_name: string;
//     redemption_type: 'percentage' | 'fixed_amount';
//     discount_amount?: number;
//     discount_percentage?: number;
//     quantity_available?: number;
//     minimum_spending: number;
//     // fixed_discount_cap?: number;
//     validity_period: number;
//     valid_from?: string;
//     valid_until?: string;
//     created_at: string;
//     updated_at: string;
//     redemption_item_status: 'expired' | 'active' | 'suspended' | 'scheduled';
// }

// const GetRedemptionItemDetailPage: React.FC = () => {
//     const params = useParams();
//     const router = useRouter();
//     const redemption_item_id = params.redemption_item_id;

//     const [isActive, setIsActive] = useState<boolean>(false);
//     const [redemptionItem, setRedemptionItem] = useState<RedemptionItem | null>(null);
//     const [selectedDiscountType, setSelectedDiscountType] = useState<'fixed_amount' | 'percentage'>('fixed_amount');
//     const [loading, setLoading] = useState<boolean>(true);
//     const [updating, setUpdating] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [form] = Form.useForm();

//     useEffect(() => {
//         const fetchRedemptionItem = async () => {
//             try {
//                 console.log(redemption_item_id)
//                 const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/get_redemption_item_detail/${redemption_item_id}`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     credentials: 'include',
//                 });

//                 if (!response.ok) {
//                     throw new Error(`Failed to fetch redemption item: ${response.status}`);
//                 }

//                 const data: RedemptionItem = await response.json();
//                 setRedemptionItem(data);
//                 setSelectedDiscountType(data.redemption_type);

//                 if (data.redemption_item_status === 'suspended') {
//                     setIsActive(false);
//                 } else {
//                     setIsActive(true);
//                 }

//                 // Set form fields
//                 form.setFieldsValue({
//                     redemption_item_name: data.redemption_item_name,
//                     redemption_type: data.redemption_type,
//                     discount_amount: data.discount_amount,
//                     discount_percentage: data.discount_percentage,
//                     // fixed_discount_cap: data.fixed_discount_cap,
//                     minimum_spending: data.minimum_spending,
//                     validity_period: data.validity_period,
//                     quantity_available: data.quantity_available,
//                     validity_range: data.valid_from && data.valid_until ? [dayjs(data.valid_from), dayjs(data.valid_until)] : [],
//                 });
//             } catch (error: any) {
//                 console.error('Error fetching redemption item:', error);
//                 setError(error.message);
//                 message.error(`Error fetching redemption item: ${error.message}`);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (redemption_item_id) {
//             fetchRedemptionItem();
//         }
//     }, [redemption_item_id, form]);

//     const handleDiscountTypeChange = (value: 'fixed_amount' | 'percentage') => {
//         setSelectedDiscountType(value);
//         // Reset relevant fields
//         if (value === 'fixed_amount') {
//             // form.setFieldsValue({ discount_percentage: undefined, fixed_discount_cap: undefined });
//             form.setFieldsValue({ discount_percentage: undefined });
//         } else {
//             form.setFieldsValue({ discount_amount: undefined });
//         }
//     };

//     const onFinish = async (values: any) => {
//         // Build the updated item object
//         const updatedItem = {
//             redemption_item_name: values.redemption_item_name,
//             redemption_type: values.redemption_type,
//             discount_amount: values.discount_amount,
//             discount_percentage: values.discount_percentage,
//             // fixed_discount_cap: values.fixed_discount_cap,
//             minimum_spending: values.minimum_spending,
//             validity_period: values.validity_period,
//             // Include future fields if necessary
//         };

//         try {
//             setUpdating(true);

//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/put_redemption_item_detail/${redemption_item_id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify(updatedItem),
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to update redemption item: ${response.status}`);
//             }

//             const result = await response.json();

//             setRedemptionItem(result); // Update local state with the latest data
//             message.success('Redemption item updated successfully!');
//         } catch (error: any) {
//             console.error('Error updating redemption item:', error);
//             message.error(`Failed to update redemption item: ${error.message}`);
//         } finally {
//             setUpdating(false);
//         }
//     };



//     const handleDelete = async () => {
//         try {

//             Modal.confirm({

//                 title: 'Are you sure you want to delete this redemption item?',
//                 okText: 'Yes',
//                 okType: 'danger',
//                 cancelText: 'No',
//                 onOk: async () => {

//                     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/delete_redemption_item/${redemption_item_id}`, {
//                         method: 'PUT',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         credentials: 'include',
//                     });

//                     if (!response.ok) {
//                         throw new Error(`Failed to delete redemption item: ${response.status}`);
//                     }

//                     message.success('Redemption item deleted successfully!');
//                     router.push('/dashboard/discount_code_list/redemption_item'); // Navigate back to the list
//                 },
//             });
//         } catch (error: any) {
//             console.error('Error deleting redemption item:', error);
//             message.error(`Failed to delete redemption item: ${error.message}`);
//         }
//     };

//     const handleToggleActive = async (checked: boolean) => {
//         try {
//             setUpdating(true);

//             const status = checked ? 'enable' : 'suspended';

//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/put_discount_code_is_active/${redemption_item_id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify({ action: status }),
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to update status: ${response.status}`);
//             }

//             const result = await response.json();

//             // Update local state
//             setRedemptionItem(result);
//             setIsActive(checked); // Update state directly based on switch value
//             message.success('Discount code status updated successfully!');
//         } catch (error: any) {
//             console.error('Error updating status:', error);
//             setIsActive(!checked); // Revert the state
//             message.error(`Failed to update status: ${error.message}`);
//         } finally {
//             setUpdating(false);
//         }
//     };



//     if (loading) {
//         return (
//             <div style={{ textAlign: 'center', padding: '50px' }}>
//                 <Spin tip="Loading..." size="large" />
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div style={{ textAlign: 'center', padding: '50px' }}>
//                 <Alert message="Error" description={error} type="error" showIcon />
//             </div>
//         );
//     }

//     return (
//         <>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Title level={2}>禮遇換領詳情</Title>
//                 <Button type="primary" onClick={() => router.back()}>
//                     Back
//                 </Button>
//             </div>

//             <Form.Item label="狀態">
//                 <Switch
//                     checkedChildren="已啟用"
//                     unCheckedChildren="已停用"
//                     checked={isActive}
//                     onChange={(checked) => handleToggleActive(checked)}
//                 />
//             </Form.Item>


//             <Card style={{ marginTop: 16 }}>
//                 <Form form={form} onFinish={onFinish} layout="vertical">
//                     {/* Discount Type */}
//                     <Form.Item
//                         name="redemption_type"
//                         label="禮遇類別"
//                         rules={[{ required: true, message: 'Please select a discount type' }]}
//                     >
//                         <Select onChange={handleDiscountTypeChange} disabled>
//                             <Option value="fixed_amount">Fixed Amount Discount</Option>
//                             <Option value="percentage">Percentage Discount</Option>
//                         </Select>
//                     </Form.Item>

//                     {/* Redemption Item Name */}
//                     <Form.Item
//                         name="redemption_item_name"
//                         label="禮遇名稱"
//                         rules={[{ required: true, message: 'Please enter the redemption item name' }]}
//                     >
//                         <Input disabled />
//                     </Form.Item>

//                     {/* Discount Fields */}
//                     {selectedDiscountType === 'fixed_amount' && (
//                         <Form.Item
//                             name="discount_amount"
//                             label="折扣額"
//                             rules={[{ required: true, message: 'Please enter the discount amount' }]}
//                         >
//                             <InputNumber min={0} style={{ width: '100%' }} disabled />
//                         </Form.Item>
//                     )}

//                     {selectedDiscountType === 'percentage' && (
//                         <>
//                             <Form.Item
//                                 name="discount_percentage"
//                                 label="折扣額"
//                                 rules={[{ required: true, message: 'Please enter the discount percentage' }]}
//                             >
//                                 <InputNumber<number>
//                                     min={1}
//                                     max={100}
//                                     style={{ width: '100%' }}
//                                     formatter={(value) => `${value}%`}
//                                     parser={(value) => parseFloat(value!.replace('%', '') || '0')}
//                                     disabled
//                                 />
//                             </Form.Item>
//                             {/* <Form.Item
//                                 name="fixed_discount_cap"
//                                 label="最高折扣限額"
//                                 rules={[{ required: true, message: 'Please enter the fixed discount cap' }]}
//                             >
//                                 <InputNumber min={0} style={{ width: '100%' }} />
//                             </Form.Item> */}
//                         </>
//                     )}

//                     {/* Minimum Spending */}
//                     <Form.Item
//                         name="minimum_spending"
//                         label="最低消費"
//                         rules={[{ required: true, message: 'Please enter the minimum spending' }]}
//                     >
//                         <InputNumber min={0} style={{ width: '100%' }} disabled />
//                     </Form.Item>

//                     {/* Validity Period */}
//                     <Form.Item
//                         name="validity_period"
//                         label="折扣券有效期 (月)"
//                         rules={[{ required: true, message: 'Please enter the validity period' }]}
//                     >
//                         <InputNumber min={1} style={{ width: '100%' }} disabled />
//                     </Form.Item>

//                     <Form.Item
//                         name="redeem_point"
//                         label="所需積分"
//                         rules={[{ required: true, message: '輸入換領所需要的積分' }]}
//                     >
//                         <InputNumber min={0} style={{ width: '100%' }} />
//                     </Form.Item>

//                     {/* Future Development Fields */}
//                     <Form.Item
//                         name="quantity_available"
//                         label="可兌換總數（未開放）"
//                         tooltip="This field is for future development"
//                     >
//                         <InputNumber min={0} style={{ width: '100%' }} disabled />
//                     </Form.Item>

//                     <Form.Item
//                         name="valid_from"
//                         label="換領開始日期"
//                         rules={[{ required: true, message: '請選擇生效日期' }]}
//                     >
//                         <DatePicker
//                             showTime
//                             format="YYYY-MM-DD HH:mm"
//                             style={{ width: '100%' }}
//                         />
//                     </Form.Item>

//                     <Form.Item shouldUpdate noStyle>
//                         {() => (
//                             <Form.Item
//                                 name="valid_until"
//                                 label="換領結束日期"
//                                 rules={[
//                                     { required: true, message: '請選擇到期日期' },
//                                     ({ getFieldValue }) => ({
//                                         validator(_, value) {
//                                             if (!value || !getFieldValue('valid_from') || value.isAfter(getFieldValue('valid_from'))) {
//                                                 return Promise.resolve();
//                                             }
//                                             return Promise.reject(new Error('到期日期必須在生效日期之後'));
//                                         },
//                                     }),
//                                 ]}
//                             >
//                                 <DatePicker
//                                     showTime
//                                     format="YYYY-MM-DD HH:mm"
//                                     style={{ width: '100%' }}
//                                 />
//                             </Form.Item>
//                         )}
//                     </Form.Item>


//                     <Form.Item
//                         name="redemption_content"
//                         label="禮物詳情"
//                         rules={[{ required: true, message: '輸入禮物詳情' }]}
//                     >
//                         <Input />
//                     </Form.Item>


//                     <Form.Item
//                         name="redemption_term"
//                         label="條款及細則"
//                         rules={[{ required: true, message: '輸入禮物的條款及細則' }]}
//                     >
//                         <Input />
//                     </Form.Item>


//                     {/* Submit Button */}
//                     <Form.Item>
//                         <Button type="primary" htmlType="submit" loading={updating}>
//                             Update Redemption Item
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Card>

//             {/* Delete Button */}
//             <Button type="primary" danger onClick={handleDelete} style={{ marginTop: 16 }}>
//                 Delete Redemption Item
//             </Button>
//         </>
//     );
// };

// export default GetRedemptionItemDetailPage;