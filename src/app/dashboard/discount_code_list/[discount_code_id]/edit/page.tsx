// src/app/dashboard/discount_code_list/[discount_code_id]/edit/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Select,
    Typography,
    message,
    Spin,
    Alert,
    DatePicker,
    Modal,
    Descriptions,
    Switch
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface DiscountCode {
    discount_code_id: number;
    discount_code_name: string;
    discount_code: string;
    discount_type: 'fixed_amount' | 'percentage';
    discount_amount?: number;
    discount_percentage?: number;
    minimum_spending: number;
    // fixed_discount_cap?: number;
    use_limit_type: 'single_use' | 'once_per_customer' | 'unlimited';
    valid_from?: string;
    valid_until?: string;
    created_at: string;
    updated_at: string;
    discount_code_status: 'expired' | 'active' | 'suspended' | 'scheduled';
    discount_code_content: string;
    discount_code_term: string;
}

const GetDiscountCodeDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const discount_code_id = params.discount_code_id;
    console.log(discount_code_id)

    const [isActive, setIsActive] = useState<boolean>(false);
    const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);
    const [selectedDiscountType, setSelectedDiscountType] = useState<'fixed_amount' | 'percentage'>('fixed_amount');
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchDiscountCode = async () => {
            try {
                console.log(discount_code_id)
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/get_discount_code_detail/${discount_code_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch discount code: ${response.status}`);
                }

                const data: DiscountCode = await response.json();
                setDiscountCode(data);
                setSelectedDiscountType(data.discount_type);

                if (data.discount_code_status === 'suspended') {
                    setIsActive(false);
                } else {
                    setIsActive(true);
                }

                // Set form fields
                form.setFieldsValue({
                    discount_code_name: data.discount_code_name,
                    discount_code: data.discount_code,
                    discount_type: data.discount_type,
                    discount_amount: data.discount_amount,
                    discount_percentage: data.discount_percentage,
                    // fixed_discount_cap: data.fixed_discount_cap,
                    minimum_spending: data.minimum_spending,
                    use_limit_type: data.use_limit_type,
                    valid_from: data.valid_from ? dayjs(data.valid_from) : null,
                    valid_until: data.valid_until ? dayjs(data.valid_until) : null,
                    discount_code_content: data.discount_code_content,
                    discount_code_term: data.discount_code_term,
                });


            } catch (error: any) {
                console.error('Error fetching discount code:', error);
                setError(error.message);
                message.error(`Error fetching discount code: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (discount_code_id) {
            fetchDiscountCode();
        }
    }, [discount_code_id, form]);

    const handleDiscountTypeChange = (value: 'fixed_amount' | 'percentage') => {
        setSelectedDiscountType(value);
        // Reset relevant fields
        if (value === 'fixed_amount') {
            // form.setFieldsValue({ discount_percentage: undefined, fixed_discount_cap: undefined });
            form.setFieldsValue({ discount_percentage: undefined });
        } else {
            form.setFieldsValue({ discount_amount: undefined });
        }
    };

    const onFinish = async (values: any) => {

        const updatedCode = {
            discount_code_name: values.discount_code_name,
            discount_code: values.discount_code,
            discount_type: values.discount_type,
            discount_amount: values.discount_amount,
            discount_percentage: values.discount_percentage,
            // fixed_discount_cap: values.fixed_discount_cap,
            minimum_spending: values.minimum_spending,
            use_limit_type: values.use_limit_type,
            valid_from: values.valid_from ? values.valid_from.toISOString() : null,
            valid_until: values.valid_until ? values.valid_until.toISOString() : null,
            discount_code_content: values.discount_code_content,
            discount_code_term: values.discount_code_term,
        };

        try {
            setUpdating(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/put_discount_code_detail/${discount_code_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedCode),
            });

            if (!response.ok) {
                throw new Error(`Failed to update discount code: ${response.status}`);
            }

            const result = await response.json();

            setDiscountCode(result); // Update local state with the latest data
            message.success('Discount code updated successfully!');
        } catch (error: any) {
            console.error('Error updating discount code:', error);
            message.error(`Failed to update discount code: ${error.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        try {
            Modal.confirm({
                title: 'Are you sure you want to delete this discount code?',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: async () => {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/delete_discount_code/${discount_code_id}`, {
                        method: 'PUT',
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to delete discount code: ${response.status}`);
                    }

                    message.success('Discount code deleted successfully!');
                    router.push('/dashboard/discount_code_list'); // Navigate back to the list
                },
            });
        } catch (error: any) {
            console.error('Error deleting discount code:', error);
            message.error(`Failed to delete discount code: ${error.message}`);
        }
    };

    const handleToggleActive = async (checked: boolean) => {
        try {
            setUpdating(true);

            const status = checked ? 'enable' : 'suspended';

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/put_discount_code_is_active/${discount_code_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ action: status }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`);
            }

            const result = await response.json();

            // Update local state
            setDiscountCode(result);
            setIsActive(checked); // Update state directly based on switch value
            message.success('Discount code status updated successfully!');
        } catch (error: any) {
            console.error('Error updating status:', error);
            setIsActive(!checked); // Revert the state
            message.error(`Failed to update status: ${error.message}`);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin tip="Loading..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <>

        <div className="modalTitle">
            <img src="/coupon.png" alt="Icon" style={{ width: '24px' }} /> 
            <span className="BigcountText">優惠詳情</span>
        

            <Button
            type="text"
            onClick={() => router.back()}
            icon={<CloseOutlined />}
            style={{
                marginLeft: 'auto',
                fontSize: '16px', // 圖標大小
              }}
        />
        </div>
       
            
        <div className="switch-container">
        <span className="switch-text">
            {isActive ? '已啟用' : '已停用'}
        </span>
        <Switch
            checked={isActive}
            onChange={(checked) => handleToggleActive(checked)}
        />
        </div>



            

            <Card style={{ marginTop: 16 }}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    {/* Discount Type */}
                    <Form.Item
                        name="discount_type"
                        label="折扣類型"
                        rules={[{ required: true, message: 'Please select a discount type' }]}
                    >
                        <Select onChange={handleDiscountTypeChange} disabled>
                            <Option value="fixed_amount">固定金額</Option>
                            <Option value="percentage">百分比</Option>
                        </Select>
                    </Form.Item>

                    {/* Discount Code Name */}
                    <Form.Item
                        name="discount_code_name"
                        label="折扣名稱"
                        rules={[{ required: true, message: 'Please enter the discount code name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="discount_code"
                        label="優惠碼"
                        rules={[{ required: true, message: 'Please enter the discount code name' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    {/* Discount Fields */}
                    {selectedDiscountType === 'fixed_amount' && (
                        <Form.Item
                            name="discount_amount"
                            label="折扣額"
                            rules={[{ required: true, message: 'Please enter the discount amount' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    )}

                    {selectedDiscountType === 'percentage' && (
                        <>
                            <Form.Item
                                name="discount_percentage"
                                label="折扣百分比"
                                rules={[{ required: true, message: 'Please enter the discount percentage' }]}
                            >
                                <InputNumber<number>
                                    min={1}
                                    max={100}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => parseFloat(value!.replace('%', '') || '0')}
                                />
                            </Form.Item>
                            <Form.Item
                                name="fixed_discount_cap"
                                label="最高折扣限額"
                                rules={[{ required: true, message: 'Please enter the fixed discount cap' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        name="use_limit_type"
                        label="使用限制"
                        rules={[{ required: true, message: 'Please select a use limit type' }]}
                    >
                        <Select>
                            <Option value="single_use">優惠碼只能使用一次</Option>
                            <Option value="once_per_customer">優惠碼每人可以使用一次</Option>
                            <Option value="unlimited">優惠碼使用沒有限制</Option>
                        </Select>
                    </Form.Item>


                    {/* Minimum Spending */}
                    <Form.Item
                        name="minimum_spending"
                        label="最低消費金額"
                        rules={[{ required: true, message: 'Please enter the minimum spending' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    {/* Validity Period */}
                    {/* <Form.Item
                        name="validity_period"
                        label="折扣券有效期 (月)"
                        rules={[{ required: true, message: 'Please enter the validity period' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item> */}

                    {/* Future Development Fields */}
                    {/* <Form.Item
                        name="quantity_available"
                        label="可兌換總數（未開放）"
                        tooltip="This field is for future development"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} disabled />
                    </Form.Item> */}

                    {/* <Form.Item
                        name="validity_range"
                        label="Validity Range"
                    // tooltip="These fields are for future development"
                    >
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item> */}

                    <Form.Item
                        name="valid_from"
                        label="折扣開始日期"
                        rules={[{ required: true, message: '請選擇開始日期' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item shouldUpdate noStyle>
                        {() => (
                            <Form.Item
                                name="valid_until"
                                label="折扣結束日期"
                                rules={[
                                    { required: true, message: '請選擇結束日期' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || !getFieldValue('valid_from') || value.isAfter(getFieldValue('valid_from'))) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('結束日期必須在開始日期之後'));
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        )}
                    </Form.Item>


                    <Form.Item
                        name="discount_code_content"
                        label="詳情"
                        rules={[{ required: true, message: '輸入優惠詳情' }]}
                    >
                        <TextArea
                            placeholder="輸入優惠詳情"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </Form.Item>


                    <Form.Item
                        name="discount_code_term"
                        label="條款及細則"
                        rules={[{ required: true, message: '輸入優惠的條款及細則' }]}
                    >
                        <TextArea
                            placeholder="輸入優惠的條款及細則"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </Form.Item>


                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={updating}>
                            Update Discount Code
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Non-Editable Fields */}
            {/* <Card title="Additional Information" style={{ marginTop: 16 }}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Created At">
                        {discountCode?.created_at ? new Date(discountCode.created_at).toLocaleString() : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {discountCode?.updated_at ? new Date(discountCode.updated_at).toLocaleString() : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        {discountCode?.discount_code_status || 'N/A'}
                    </Descriptions.Item>
                </Descriptions>
            </Card> */}

            {/* Delete Button */}
            <Button type="primary" danger onClick={handleDelete} style={{ marginTop: 16 }}>
                Delete Discount Code
            </Button>
        </>
    );
};

export default GetDiscountCodeDetailPage;