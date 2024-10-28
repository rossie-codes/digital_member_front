// src/app/dashboard/broadcast_setting/page.tsx

'use client';
import { useEffect, useState, useRef } from 'react';
import { Table, Input, Space, Button, Modal, Form, message } from 'antd';
import type { TableColumnsType, PaginationProps } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Search } = Input;

interface DataType {
  key: string;
  broadcast_name: string;
  wati_template: string;
  scheduled_start: string;
  recipient_count: number;
}

interface FetchParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
  filters?: any;
  searchText?: string;
}

const BroadcastSettingPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  const router = useRouter();
  const handleEdit = (record: DataType) => {
    router.push(`/dashboard/broadcast_setting/${record.key}/edit`);
  };

  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchData = async (params: FetchParams = { page: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const { page, pageSize, sortField, sortOrder, filters, searchText } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (sortField) queryParams.append('sortField', sortField);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);

      // Include search text in the queryParams
      if (searchText) {
        queryParams.append('searchText', searchText);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/broadcast_setting/get_broadcast_list?${queryParams.toString()}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      const broadcasts: any[] = jsonData.data;
      const total: number = jsonData.total;

      if (!Array.isArray(broadcasts)) {
        throw new Error("Invalid data format: 'broadcasts' should be an array.");
      }

      const formattedData: DataType[] = broadcasts.map((broadcast: any) => ({
        key: broadcast.broadcast_id ? broadcast.broadcast_id.toString() : Math.random().toString(),
        broadcast_name: broadcast.broadcast_name || 'N/A',
        wati_template: broadcast.wati_template || 'N/A',
        scheduled_start: broadcast.scheduled_start
          ? formatDate(broadcast.scheduled_start)
          : 'N/A',
        recipient_count: broadcast.recipient_count || 0,
      }));

      setData(formattedData);
      setTotalItems(total);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string): string => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Use effect to fetch data on component mount
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData({
        page: currentPage,
        pageSize: pageSize,
        searchText: searchText,
      });
    }
  }, [currentPage, pageSize, searchText]);

  const onSearch = (value: string) => {
    const trimmedValue = value.trim().toLowerCase();
    setSearchText(trimmedValue);

    // Reset pagination to the first page when a new search is performed
    setCurrentPage(1);

    fetchData({
      page: 1,
      pageSize: pageSize,
      searchText: trimmedValue,
    });
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Broadcast Name',
      dataIndex: 'broadcast_name',
      key: 'broadcast_name',
    },
    {
      title: 'WATI Template',
      dataIndex: 'wati_template',
      key: 'wati_template',
    },
    {
      title: 'Scheduled Start',
      dataIndex: 'scheduled_start',
      key: 'scheduled_start',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Recipient Count',
      dataIndex: 'recipient_count',
      key: 'recipient_count',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      align: 'right',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: DataType) => (
        <Button
          type="link"
          icon={<FormOutlined style={{ color: '#ff4d4f' }} />}
          onClick={() => handleEdit(record)}
        />
      ),
    },
  ];

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);

    // Prepare sort parameters
    let sortField = sorter.field;
    let sortOrder = sorter.order;
    if (sortOrder) {
      // Convert sortOrder to 'ascend' or 'descend'
      sortOrder = sorter.order === 'ascend' ? 'ascend' : 'descend';
    }

    // Fetch data based on the new pagination and sorting
    fetchData({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sortField,
      sortOrder: sortOrder,
      searchText: searchText,
    });
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Space direction="horizontal" style={{ marginBottom: '20px' }}>
        <Search
          placeholder="Search broadcasts"
          allowClear
          onSearch={onSearch}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => router.push('/dashboard/broadcast_setting/new')}>
          New Broadcast
        </Button>
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        locale={{ emptyText: 'No broadcasts found.' }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showTotal: showTotal,
          showSizeChanger: true,
          showQuickJumper: true,
          position: ['bottomRight'],
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default BroadcastSettingPage;