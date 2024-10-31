// src/app/dashboard/discount_code_list/deleted_discount_code/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Space,
  Modal,
  Typography,
  message,
  Spin,
  Alert,
} from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const { Title } = Typography;

interface DiscountCode {
    key: number;
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

const DeletedDiscountCodePage: React.FC = () => {
  const [DiscountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();

  const rowSelection: TableRowSelection<DiscountCode> = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // Fetch deleted redemption items on component mount
  useEffect(() => {
    const fetchDeletedDiscountCodes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/get_deleted_discount_code_list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 404) {
          // No deleted redemption items found, initialize with empty array
          setDiscountCodes([]);
        } else if (!response.ok) {
          throw new Error(`Failed to fetch deleted redemption items: ${response.status}`);
        } else {
          const data: DiscountCode[] = await response.json();
          setDiscountCodes(data);
        }
      } catch (error: any) {
        console.error('Error fetching deleted redemption items:', error);
        setError(error.message);
        message.error(`Error fetching deleted redemption items: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedDiscountCodes();
  }, []);

  // Table columns
  const columns: TableColumnsType<DiscountCode> = [
    {
      title: '折扣名稱',
      dataIndex: 'discount_code_name',
      key: 'discount_code_name',
    },
    {
      title: '折扣碼',
      dataIndex: 'discount_code',
      key: 'discount_code',
    },
    {
      title: '折扣類別',
      dataIndex: 'discount_type',
      key: 'discount_type',
      render: (text) => (text === 'fixed_amount' ? 'Fixed Amount' : 'Percentage'),
    },
    {
      title: '折扣額',
      key: 'discount_amount',
      render: (_, record) =>
        record.discount_type === 'fixed_amount'
          ? `$${record.discount_amount}`
          : `${record.discount_percentage}%`,
    },
    {
      title: '最低消費',
      dataIndex: 'minimum_spending',
      key: 'minimum_spending',
      render: (text) => `$${text}`,
    },
    // {
    //   title: '最高折扣限額',
    //   dataIndex: 'fixed_discount_cap',
    //   key: 'fixed_discount_cap',
    //   render: (text, record) => (record.discount_type === 'percentage' ? `$${text}` : '--'),
    // },
    {
      title: '有效期（開始）',
      dataIndex: 'valid_from',
      key: 'valid_from',
      render: (text) => (text ? new Date(text).toLocaleDateString() : '--'),
    },
    {
      title: '有效期（結束）',
      dataIndex: 'valid_until',
      key: 'valid_until',
      render: (text) => (text ? new Date(text).toLocaleDateString() : '--'),
    },
    {
      title: '使用限制',
      dataIndex: 'use_limit_type',
      key: 'use_limit_type',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<UndoOutlined />} onClick={() => handleRestoreItem(record.discount_code_id)}>
            Restore
          </Button>
          {/* <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handlePermanentDeleteItem(record.redemption_item_id)}>
            Delete Permanently
          </Button> */}
        </Space>
      ),
    },
  ];

  // Function to handle restoring an item
  const handleRestoreItem = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/discount_code/restore_discount_code/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ deleted_status: false }),
      });

      if (!response.ok) {
        throw new Error(`Failed to restore item: ${response.status}`);
      }

      // Remove the item from the state
      setDiscountCodes((prevItems) => prevItems.filter((item) => item.discount_code_id !== id));
      message.success('Item restored successfully!');
    } catch (error: any) {
      console.error('Error restoring item:', error);
      message.error(`Failed to restore item: ${error.message}`);
    }
  };

  // Function to handle permanent deletion of an item
  // const handlePermanentDeleteItem = async (id: number) => {
  //   try {
  //     Modal.confirm({
  //       title: 'Are you sure you want to permanently delete this item?',
  //       okText: 'Yes',
  //       okType: 'danger',
  //       cancelText: 'No',
  //       onOk: async () => {
  //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/permanent_delete_item/${id}`, {
  //           method: 'DELETE',
  //         });
  //         if (!response.ok) {
  //           throw new Error(`Failed to permanently delete item: ${response.status}`);
  //         }
  //         // Remove the item from the state
  //         setDiscountCodes((prevItems) => prevItems.filter((item) => item.redemption_item_id !== id));
  //         message.success('Item permanently deleted!');
  //       },
  //     });
  //   } catch (error: any) {
  //     console.error('Error deleting item:', error);
  //     message.error(`Failed to delete item: ${error.message}`);
  //   }
  // };

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>已刪除的折扣券</Title>
        <Button type="primary" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={DiscountCodes}
        rowKey="redemption_item_id"
        style={{ marginTop: 16 }}
        locale={{ emptyText: 'No deleted redemption items found.' }}
      />
    </div>
  );
};

export default DeletedDiscountCodePage;