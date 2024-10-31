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
} from 'antd';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
    is_active: boolean;
}

const GetDiscountCodeDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const discount_code_id = params.discount_code_id;
    console.log(discount_code_id)

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
                console.log(data)
                setDiscountCode(data);
                setSelectedDiscountType(data.discount_type);

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
                        method: 'DELETE',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2}>折扣券詳情</Title>
                <Button type="primary" onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <Card style={{ marginTop: 16 }}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    {/* Discount Type */}
                    <Form.Item
                        name="discount_type"
                        label="折扣類別"
                        rules={[{ required: true, message: 'Please select a discount type' }]}
                    >
                        <Select onChange={handleDiscountTypeChange} disabled>
                            <Option value="fixed_amount">Fixed Amount Discount</Option>
                            <Option value="percentage">Percentage Discount</Option>
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
                        label="折扣碼"
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
                                label="折扣額"
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
                            {/* <Form.Item
                                name="fixed_discount_cap"
                                label="最高折扣限額"
                                rules={[{ required: true, message: 'Please enter the fixed discount cap' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item> */}
                        </>
                    )}

                    {/* Minimum Spending */}
                    <Form.Item
                        name="minimum_spending"
                        label="最低消費"
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
                    <Form.Item
                        name="quantity_available"
                        label="可兌換總數（未開放）"
                        tooltip="This field is for future development"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} disabled />
                    </Form.Item>

                    <Form.Item
                        name="validity_range"
                        label="Validity Range"
                    // tooltip="These fields are for future development"
                    >
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="discount_content"
                        label="優惠詳情"
                        rules={[{ required: true, message: '輸入禮物詳情' }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        name="term_and_condition"
                        label="條款及細則"
                        rules={[{ required: true, message: '輸入禮物的條款及細則' }]}
                    >
                        <Input />
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
            <Card title="Additional Information" style={{ marginTop: 16 }}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Created At">
                        {discountCode?.created_at ? new Date(discountCode.created_at).toLocaleString() : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {discountCode?.updated_at ? new Date(discountCode.updated_at).toLocaleString() : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Active">
                        {discountCode?.is_active ? 'Yes' : 'No'}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Delete Button */}
            <Button type="primary" danger onClick={handleDelete} style={{ marginTop: 16 }}>
                Delete Discount Code
            </Button>
        </>
    );
};

export default GetDiscountCodeDetailPage;