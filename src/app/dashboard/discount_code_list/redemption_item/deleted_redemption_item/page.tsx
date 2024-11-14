// src/app/dashboard/app_setting/redemption_item/deleted_redemption_item/page.tsx

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

interface RedemptionItem {
  created_at: string;
  redemption_item_id: number;
  redemption_item_name: string;
  redemption_type: 'fixed_amount' | 'percentage';
  discount_amount?: number;
  discount_percentage?: number;
  // fixed_discount_cap?: number;
  minimum_spending: number;
  validity_period: number;
  is_active: boolean;
  deleted_status?: boolean;
}

const DeletedRedemptionItemsPage: React.FC = () => {
  const [redemptionItems, setRedemptionItems] = useState<RedemptionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();

  const rowSelection: TableRowSelection<RedemptionItem> = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // Fetch deleted redemption items on component mount
  useEffect(() => {
    const fetchDeletedRedemptionItems = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/get_deleted_redemption_item_list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 404) {
          // No deleted redemption items found, initialize with empty array
          setRedemptionItems([]);
        } else if (!response.ok) {
          throw new Error(`Failed to fetch deleted redemption items: ${response.status}`);
        } else {
          const data: RedemptionItem[] = await response.json();
          setRedemptionItems(data);
        }
      } catch (error: any) {
        console.error('Error fetching deleted redemption items:', error);
        setError(error.message);
        message.error(`Error fetching deleted redemption items: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedRedemptionItems();
  }, []);

  // Table columns
  const columns: TableColumnsType<RedemptionItem> = [
    {
      title: '建立日期',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: '禮遇名稱',
      dataIndex: 'redemption_item_name',
      key: 'redemption_item_name',
    },
    {
      title: '禮遇類別',
      dataIndex: 'redemption_type',
      key: 'redemption_type',
      render: (text) => (text === 'fixed_amount' ? 'Fixed Amount' : 'Percentage'),
    },
    {
      title: '折扣額',
      key: 'discount_amount',
      render: (_, record) =>
        record.redemption_type === 'fixed_amount'
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
    //   render: (text, record) => (record.redemption_type === 'percentage' ? `$${text}` : '--'),
    // },
    {
      title: '折扣券有效期 (月)',
      dataIndex: 'validity_period',
      key: 'validity_period',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<UndoOutlined />} onClick={() => handleRestoreItem(record.redemption_item_id)}>
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/redemption_item/restore_redemption_item/${id}`, {
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
      setRedemptionItems((prevItems) => prevItems.filter((item) => item.redemption_item_id !== id));
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
  //         setRedemptionItems((prevItems) => prevItems.filter((item) => item.redemption_item_id !== id));
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
        <Title level={2}>已刪除的禮遇項目</Title>
        <Button type="primary" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={redemptionItems}
        rowKey="redemption_item_id"
        style={{ marginTop: 16 }}
        locale={{ emptyText: 'No deleted redemption items found.' }}
      />
    </div>
  );
};

export default DeletedRedemptionItemsPage;