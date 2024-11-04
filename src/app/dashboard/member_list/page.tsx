// src/app/dashboard/member_list/page.tsx

'use client';
import { useEffect, useState, useRef } from 'react';
import { Table, Input, Space, Button, Modal, Form, message } from 'antd';
import type { TableColumnsType, PaginationProps } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { FormOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // For Next.js 13 with app directory
import { Row, Col, Card, Tooltip} from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from './Card.module.css';
// import { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';

const { Search } = Input;

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
  key: string;
  member_name: string;
  member_phone: string | number;
  point: string | number;
  membership_tier: string;
  membership_expiry_date: string;
  is_active: string; // Add this line
}

interface NewMember {
  member_name: string;
  member_phone: number;
  birthday: string | null;
  referrer_phone: number | null;
  point: number;
}

interface FetchParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
  filters?: any;
  searchText?: string;
}





const GetMemberListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  const router = useRouter();
  const handleEdit = (record: DataType) => {
    router.push(`/dashboard/member_list/${record.member_phone}/edit`);
  };

  const [data, setData] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tierFilterOptions, setTierFilterOptions] = useState<{ text: string; value: string }[]>([]);
  const [tableFilters, setTableFilters] = useState<any>({});
  const [searchText, setSearchText] = useState<string>('');
  const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;


  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [addingMember, setAddingMember] = useState<boolean>(false);


  const statusMapping: { [key: number]: string } = {
    0: 'expired',
    1: 'active',
    2: 'suspended',
  };
  const statusOptions = [
    { text: 'expired', value: 0 },
    { text: 'active', value: 1 },
    { text: 'suspended', value: 2 },
  ];

  const [membershipTiers, setMembershipTiers] = useState<string[]>([]);
  const icons = ['/blue.png', '/pink.png', '/purple.png', '/green.png']; 
  const dynamicIcons = ['/1st.png', '/2nd.png', '/3rd.png', '/Amount.png'];

  // Separate pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };
  const hasSelected = selectedRowKeys.length > 0;

  // const { token } = useContext(AuthContext);


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

      // Include filters dynamically
      if (filters) {
        Object.keys(filters).forEach((key) => {
          const filterValues = filters[key];
          if (filterValues && filterValues.length > 0) {
            filterValues.forEach((value: string) => {
              queryParams.append(key, value);
            });
          }
        });
      }


      // Include search text in the queryParams
      if (searchText) {
        queryParams.append('searchText', searchText);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/get_member_list?${queryParams.toString()}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('Parsed JSON Data:', jsonData);

      const members: any[] = jsonData.data;
      const total: number = jsonData.total;
      const membershipTiers: string[] = jsonData.membership_tiers || [];


      if (!Array.isArray(members)) {
        throw new Error("Invalid data format: 'members' should be an array.");
      }

      const formatDate = (isoString: string): string => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedData: DataType[] = members.map((member: any) => ({
        key: member.member_id ? member.member_id.toString() : Math.random().toString(),
        member_name: member.member_name || 'N/A',
        member_phone: member.member_phone || 'N/A',
        point: member.point || 'N/A',
        membership_tier: member.membership_tier
          ? member.membership_tier.membership_tier_name
          : 'N/A',
        membership_expiry_date: formatDate(member.membership_expiry_date),
        is_active: statusMapping[member.is_active] || 'Unknown',
      }));

      setData(formattedData);

      const tierFilters = membershipTiers.map((tier) => ({
        text: tier,
        value: tier,
      }));
      setTierFilterOptions(tierFilters);

      // Update total items
      setTotalItems(total);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

// Fetch membership statistics from the backend on component mount
const [stats, setStats] = useState<StatsData | null>(null);

interface StatsData {
  new_members_count: number;
  membership_tier_counts: {
    [key: string]: number;
  };
  expiring_members_count: number;
  birthday_members_count: number;
}


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/get_member_list`, {
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data); // 查看後端數據結構
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Fetch membership tier data from the backend and set filter options
    
  useEffect(() => {
    const fetchMembershipTiers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/get_member_list`);
        const data = await response.json();
        setMembershipTiers(data.membership_tiers || []);
        
        const tierFilters = data.membership_tiers.map((tier: string) => ({
          text: tier,
          value: tier,
        }));
        setTierFilterOptions(tierFilters);
      } catch (error) {
        console.error("Failed to fetch membership tiers:", error);
      }
    };
    
    fetchMembershipTiers();
  }, []);
  

  // Adjusted useEffect
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData({
        page: currentPage,
        pageSize: pageSize,
        filters: tableFilters,
        searchText: searchText,
      });
    }
  }, [currentPage, pageSize, tableFilters, searchText]);

  const onSearch = (value: string) => {
    const trimmedValue = value.trim().toLowerCase();
    setSearchText(trimmedValue);

    // Reset pagination to the first page when a new search is performed
    setCurrentPage(1);

    fetchData({
      page: 1,
      pageSize: pageSize,
      filters: tableFilters,
      searchText: trimmedValue,
    });
  };

  const onFinish = async (values: NewMember) => {
    try {
      setAddingMember(true);
      // Send the data to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/post_new_member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      let errorMessage = 'Failed to add member';

      if (!response.ok) {
        // Try to parse the error message from the response body
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else {
            errorMessage = response.statusText || 'Failed to add member';
          }
        } catch {
          // If parsing fails, fallback to statusText or generic message
          errorMessage = response.statusText || 'Failed to add member';
        }
        // Throw an error with the specific message
        throw new Error(errorMessage);
      }

      const result = await response.json();
      message.success('Member added successfully');

      // Close the modal
      setIsModalVisible(false);
      // Reset the form fields
      form.resetFields();

      // Refresh the member list
      fetchData({
        page: currentPage,
        pageSize: pageSize,
        filters: tableFilters,
        searchText: searchText,
      });
    } catch (error: any) {
      console.error('Error adding member:', error.message);
      message.error(error.message);
    } finally {
      setAddingMember(false);
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: DataType) => (
        <Button
          type="link"
          icon={<FormOutlined style={{ color: '#ff4d4f' }} />}
          onClick={() => handleEdit(record)}
        />
      ),
      width: 50,
    },
    {
      title: '姓名',
      dataIndex: 'member_name',
      key: 'member_name',
      ellipsis: true,
      width: 150,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          {text}
        </Tooltip>
      ),
    },
    {
      title: '電話號碼',
      dataIndex: 'member_phone',
      key: 'member_phone',
    },
    {
      title: '積分',
      dataIndex: 'point',
      key: 'point',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '累計清費金額',
      dataIndex: 'point',
      key: 'point',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '生日',
      dataIndex: 'membership_expiry_date',
      key: 'membership_expiry_date',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },

    {
      title: '到期日',
      dataIndex: 'membership_expiry_date',
      key: 'membership_expiry_date',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '級別',
      dataIndex: 'membership_tier',
      key: 'membership_tier',
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      filters: tierFilterOptions,
      filteredValue: tableFilters.membership_tier || null,
      render: (text: string, record: DataType) => {
        // 根據等級名稱在 membershipTiers 中的索引選擇圖標
        const tierIndex = membershipTiers.indexOf(record.membership_tier);
        // 如果索引是 0、1、2，就使用對應的圖標；否則使用第四個圖標
        const iconSrc = tierIndex >= 0 && tierIndex < 3 ? icons[tierIndex] : icons[3];
        
        return (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <img src={iconSrc} alt={text} style={{ width: 25, height: 25, marginRight: 8 }} />
            {text}
          </span>
        );
      },
    },
    
    {
      title: '狀態',
      dataIndex: 'is_active',
      key: 'is_active',
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      filters: statusOptions,
      filteredValue: tableFilters.is_active || null,
      render: (text: string) => {
        // 設定顏色
        let color;
        if (text === 'active') {
          color = 'green';
        } else if (text === 'suspended') {
          color = 'orange';
        } else if (text === 'expired') {
          color = 'red';
        } else {
          color = 'gray'; // 如果有其他未知的狀態，可以設置為灰色
        }
    
        return (
          <span>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: color,
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );
      },
    },
  ];

  const handleTableChange = (
    pagination: any,
    filters: any,
    // sorter: { field?: string; order?: string }
    sorter: any
  ) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    setTableFilters(filters);

    // Prepare sort parameters
    let sortField = sorter.field;
    let sortOrder = sorter.order;
    if (sortOrder) {
      // Convert sortOrder to 'ascend' or 'descend'
      sortOrder = sorter.order === 'ascend' ? 'ascend' : 'descend';
    }

    // Fetch data based on the new pagination, filters, and sorting
    fetchData({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sortField,
      sortOrder: sortOrder,
      filters: filters,
      searchText: searchText, // Include search text if any
    });
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>







<div style={{ marginBottom: '20px' }}>
  <Row gutter={0} justify="space-between" align="middle">
    {/* 左邊的會員卡片區域 */}
    <Col>
      <Row gutter={0} align="middle">
        {/* 固定顯示「新會員」卡片 */}
        <Col>
          <Card className={styles.cardContainer}>
            <div className={styles.content}>
              <img src="/Amount.png" alt="新會員" className={styles.icon} />
              <div className={styles.textContainer}>
                <p className={styles.countText}>新會員</p>
                <p className={styles.BigcountText}>{stats?.new_members_count}</p>
              </div>
            </div>
          </Card>
        </Col>

        {/* 動態渲染其他會員等級卡片 */}
        {Object.entries(stats?.membership_tier_counts || {}).map(([tierName, count], index) => {
          // 根據 index 使用對應的 dynamic icon 圖片，如果 index 超過三個就使用第四個預設 icon
          const iconSrc = index < 3 ? dynamicIcons[index] : dynamicIcons[3];
          
          return (
            <Col key={tierName}>
              <Card className={styles.cardContainer}>
                <div className={styles.content}>
                  <img src={iconSrc} alt={tierName} className={styles.icon} />
                  <div className={styles.textContainer}>
                    <p className={styles.countText}>{tierName}</p>
                    <p className={styles.BigcountText}>{count}</p>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Col>

    {/* 右邊的「本月到期會員」和「本月生日會員」卡片 */}
    <Col>
      <Row gutter={0} justify="end" align="middle">
        {/* 本月到期會員 */}
        <Col>
          <Card className={`${styles.cardContainer} ${styles.expiredCard}`}>
            <div className={styles.content}>
              <div className={styles.textContainer}>
                <p className={styles.countText}>本月到期會籍</p>
                <p className={styles.BigcountText}>{stats?.expiring_members_count}</p>
                <p className={styles.sendLink}>
                  <NotificationOutlined />
                  <a href="#">傳送廣播</a>
                </p>
              </div>
            </div>
          </Card>
          <p className={styles.additionalInfo}>最後廣播：2024-08-30 11:49:27</p>
        </Col>

        {/* 本月生日會員 */}
        <Col>
          <Card className={`${styles.cardContainer} ${styles.birthdayCard}`}>
            <div className={styles.content}>
              <div className={styles.textContainer}>
                <p className={styles.countText}>本月生日會員</p>
                <p className={styles.BigcountText}>{stats?.birthday_members_count}</p>
                <p className={styles.sendLink}>
                  <NotificationOutlined />
                  <a href="#">傳送廣播</a>
                </p>
              </div>
            </div>
          </Card>
          <p className={styles.additionalInfo}>最後廣播：2024-08-30 11:49:27</p>
        </Col>
      </Row>
    </Col>
  </Row>
</div>















      <Space direction="horizontal" style={{ marginBottom: '20px' }}>
        <Search
          placeholder="輸入關鍵字"
          allowClear
          onSearch={onSearch}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
        <PlusCircleOutlined style={{ fontSize: '16px', marginRight: '5px' }} /> 新增會員
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </Space>

      <Table
        className="custom-table-header"
        rowSelection={rowSelection}
        dataSource={data}
        columns={columns}
        locale={{ emptyText: 'No members found.' }}
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

      <Modal
        title={
          <div className={styles.modalTitle}>
            <img src={icons[3]} alt="Icon" style={{ width: '24px' }} /> {/* 使用 green.png 作為標題圖示 */}
            <span className={styles.BigcountText}>新增會員</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        
        <Form form={form} onFinish={onFinish} layout="vertical">
        <div className={styles.modalContainer}>
          <Form.Item
            name="member_name"
            label="會員姓名"
            rules={[{ required: true, message: 'Please enter the member name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="member_phone"
            label="會員電話"
            rules={[{ required: true, message: 'Please enter the phone number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="birthday"
            label="會員生日 (選填)"
            rules={[{ required: false, message: 'Please enter birthday' }]}
          >
            <Input />
          </Form.Item>
          </div>
          
          <Form.Item
            name="referrer_phone"
            label="推薦人電話號碼 (選填)"
            rules={[{ required: false, message: 'Please enter the referrer phone number' }]}
            className={styles.referrerField}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item
            name="point"
            label="會員積分"
            rules={[{ required: true, message: 'Please enter the initial point' }]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={addingMember} className={styles.addButton}>
              新增
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GetMemberListPage;