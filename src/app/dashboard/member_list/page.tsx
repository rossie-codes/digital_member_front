// src/app/dashboard/member_list/page.tsx

'use client';
import { useEffect, useState, useRef } from 'react';
import { Table, Input, Space, Button, Modal, Form, message, Row, Col, Card, Tooltip } from 'antd';
import type { TableColumnsType, PaginationProps } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { FormOutlined, PlusCircleOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // For Next.js 13 with app directory
import styles from './Card.module.css';


import Link from 'next/link';

const { Search } = Input;

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
  key: string;
  member_name: string;
  member_phone: string | number;
  points_balance: string | number;
  membership_tier: string;
  membership_expiry_date: string;
  membership_status: 'expired' | 'active' | 'suspended'; // Updated field
}

interface NewMember {
  member_name: string;
  member_phone: number;
  birthday: string | null;
  year?: string;
  month?: string;
  day?: string;
  referrer_phone: number | null;
  points_balance: number;
}

interface FetchParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
  filters?: any;
  searchText?: string;
}

interface StatsData {
  new_members_count: number;
  membership_tier_counts: {
    [key: string]: number;
  };
  expiring_members_count: number;
  birthday_members_count: number;
}




const GetMemberListPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  const router = useRouter();

  const [data, setData] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tierFilterOptions, setTierFilterOptions] = useState<{ text: string; value: string }[]>([]);
  const [tableFilters, setTableFilters] = useState<any>({});
  const [searchText, setSearchText] = useState<string>('');
  const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [addingMember, setAddingMember] = useState<boolean>(false);
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');

  const statusMapping: { [key: number]: string } = {
    0: 'expired',
    1: 'active',
    2: 'suspended',
  };
  const statusOptions = [
    { text: 'expired', value: 'expired' },
    { text: 'active', value: 'active' },
    { text: 'suspended', value: 'suspended' },
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


  const [stats, setStats] = useState<StatsData | null>(null);




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
        points_balance: member.points_balance || 'N/A',
        total_order_amount: member.total_order_amount || 'N/A',
        birthday: formatDate(member.birthday),
        membership_tier: member.membership_tier
          ? member.membership_tier.membership_tier_name
          : 'N/A',
        membership_expiry_date: formatDate(member.membership_expiry_date),
        membership_status: member.membership_status || 'Unknown', // Use membership_status directly
      }));

      setData(formattedData);
      setStats(jsonData);

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

  // // Fetch membership statistics from the backend on component mount
  // const [stats, setStats] = useState<StatsData | null>(null);

  // interface StatsData {
  //   new_members_count: number;
  //   membership_tier_counts: {
  //     [key: string]: number;
  //   };
  //   expiring_members_count: number;
  //   birthday_members_count: number;
  // }


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
    // 將年、月、日組合為 `YYYY-MM-DD` 格式
    const { year, month, day } = values;
    const formattedBirthday = year && month && day ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : null;

    // 傳遞 `birthday` 到後端
    const newMemberData = {
      ...values,
      birthday: formattedBirthday,
    };
    try {
      setAddingMember(true);
      // Send the data to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/post_new_member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newMemberData),
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


  const handleSendBroadcast = async () => {
    try {
      // Fetch birthday member IDs from the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member/get_birthday_member_ids`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch birthday member IDs: ${response.status}`);
      }

      const data = await response.json();

      console.log('Birthday Member IDs:', data.member_ids[1]);

      // Adjust based on backend response structure
      // Assuming data is an array of objects with member_id
      const member_ids: number[] = data.member_ids.map((item: { member_id: number }) => item.member_id);

      console.log('member_ids:', member_ids);

      if (!member_ids || member_ids.length === 0) {
        message.warning('沒有找到本月生日會員。');
        return;
      }

      const memberIdsParam = member_ids.join(',');

      console.log('memberIdsParam:', memberIdsParam);

      // Redirect to Broadcast Settings with query parameters
      router.push(`/dashboard/broadcast_setting?openModal=true&member_ids=${memberIdsParam}`);
    } catch (error: any) {
      console.error('Error fetching birthday member IDs:', error);
      message.error('無法獲取本月生日會員列表。');
    }
  };



  const columns: TableColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      render: (_: any, record: DataType) => (
        <Link href={`/dashboard/member_list/${record.member_phone}/edit`}>
          <Button
            type="link"
            icon={
              <span
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_808_5100)">
                    <path
                      d="M3.45872 12.284C3.49443 12.284 3.53015 12.2805 3.56586 12.2751L6.56943 11.7483C6.60515 11.7412 6.63908 11.7251 6.66408 11.6983L14.2337 4.12868C14.2503 4.11216 14.2634 4.09254 14.2724 4.07094C14.2813 4.04934 14.2859 4.02618 14.2859 4.00279C14.2859 3.9794 14.2813 3.95625 14.2724 3.93464C14.2634 3.91304 14.2503 3.89342 14.2337 3.8769L11.2659 0.907254C11.2319 0.873326 11.1873 0.855469 11.1391 0.855469C11.0909 0.855469 11.0462 0.873326 11.0123 0.907254L3.44265 8.4769C3.41586 8.50368 3.39979 8.53583 3.39265 8.57154L2.86586 11.5751C2.84849 11.6708 2.8547 11.7692 2.88395 11.862C2.91319 11.9547 2.9646 12.0389 3.03372 12.1073C3.15158 12.2215 3.29979 12.284 3.45872 12.284ZM4.66229 9.16975L11.1391 2.69475L12.448 4.00368L5.97122 10.4787L4.38372 10.759L4.66229 9.16975ZM14.5712 13.784H1.42836C1.11229 13.784 0.856934 14.0394 0.856934 14.3555V14.9983C0.856934 15.0769 0.921219 15.1412 0.999791 15.1412H14.9998C15.0784 15.1412 15.1426 15.0769 15.1426 14.9983V14.3555C15.1426 14.0394 14.8873 13.784 14.5712 13.784Z"
                      fill="#737277"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_808_5100">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            }
          />

        </Link>
      ),
      width: 50,
    },
    {
      title: '姓名',
      dataIndex: 'member_name',
      key: 'member_name',
      ellipsis: true,
      width: 150,
      render: (text, record) => (
        <Link href={`/dashboard/member_list/${record.member_phone}/edit`}>
          <Tooltip title={text} placement="topLeft">
            <span
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {text}
            </span>
          </Tooltip>
        </Link>
      ),
    },
    {
      title: (
        <span>
          電話號碼
          <WhatsAppOutlined className="whatsapp-icon" style={{ marginLeft: 6 }} />
        </span>
      ),
      dataIndex: 'member_phone',
      key: 'member_phone',
    },
    {
      title: '積分',
      dataIndex: 'points_balance',
      key: 'points_balance',
      sorter: true, // Enable server-side sorting
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '累計消費金額',
      dataIndex: 'total_order_amount',
      key: 'total_order_amount', // Adjusted key if needed
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
      title: '生日',
      dataIndex: 'birthday', // Adjusted dataIndex if birthday is available
      key: 'birthday',
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
      dataIndex: 'membership_status',
      key: 'membership_status', // Updated key
      sorter: true,
      sortDirections: ['ascend', 'descend', 'ascend'],
      filters: statusOptions,
      filteredValue: tableFilters.membership_status || null,
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


  console.log('Stats:', stats);


  return (
    <div>
      <div>
        <Row gutter={0} justify="space-between" align="middle" style={{ marginBottom: '35px' }}>
          {/* 左邊的會員卡片區域 */}
          <Col>
            <Row gutter={0} align="middle">
              {/* 固定顯示「當月新會員」卡片 */}
              <Col style={{ marginRight: '25px' }}>
                <Card className={styles.cardContainer}>
                  <div className={styles.content}>
                    <img src="/Amount.png" alt="當月新會員" className={styles.icon} />
                    <div className={styles.textContainer}>
                      <p className={styles.countText}>當月新會員</p>
                      <p className={styles.BigcountText}>{stats?.new_members_count}</p>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* 動態渲染其他會員等級卡片 */}
              {Object.entries(stats?.membership_tier_counts || {})
                .filter(([tierName]) => tierName && tierName !== "No Tier") // 過濾掉 "No Tier" 或空名稱
                .map(([tierName, count], index) => {
                  const iconSrc = dynamicIcons[index % dynamicIcons.length];
                  return (
                    <Col key={tierName} style={{ marginRight: '25px' }}>
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
              <Col style={{ marginRight: '25px' }}>
                <Card className={`${styles.cardContainer} ${styles.expiredCard}`}>
                  <div className={styles.content}>
                    <div className={styles.textContainer2}>
                      <p className={styles.countText}>本月到期會籍</p>
                      <p className={styles.BigcountText}>{stats?.expiring_members_count}</p>
                      <p className={styles.sendLink}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M19.375 9.37503C19.374 8.38078 18.9785 7.42755 18.2755 6.72452C17.5725 6.02148 16.6192 5.62606 15.625 5.62503H12.5156C12.2883 5.61174 8.32656 5.33284 4.55391 2.16878C4.37172 2.01577 4.14966 1.91793 3.9138 1.88676C3.67794 1.85558 3.43809 1.89236 3.22241 1.99278C3.00673 2.09319 2.82418 2.25307 2.69622 2.45363C2.56825 2.6542 2.50018 2.88712 2.5 3.12503V15.625C2.50003 15.863 2.568 16.096 2.6959 16.2967C2.82381 16.4974 3.00635 16.6574 3.22205 16.7579C3.43776 16.8584 3.67768 16.8953 3.91361 16.8641C4.14954 16.833 4.37167 16.7351 4.55391 16.5821C7.50469 14.1071 10.5695 13.3977 11.875 13.1992V15.6774C11.8747 15.8833 11.9254 16.0862 12.0224 16.2679C12.1195 16.4496 12.2599 16.6045 12.4312 16.7188L13.2906 17.2914C13.4567 17.4023 13.647 17.4718 13.8454 17.494C14.0439 17.5162 14.2448 17.4906 14.4313 17.4192C14.6178 17.3478 14.7845 17.2328 14.9175 17.0837C15.0504 16.9347 15.1457 16.756 15.1953 16.5625L16.1148 13.0969C17.017 12.9769 17.8448 12.5333 18.4445 11.8487C19.0441 11.1642 19.3748 10.2851 19.375 9.37503ZM3.75 15.6196V3.12503C7.09453 5.93049 10.518 6.64065 11.875 6.81565V11.9313C10.5195 12.1094 7.09688 12.818 3.75 15.6196ZM13.9844 16.2446V16.2531L13.125 15.6805V13.125H14.8125L13.9844 16.2446ZM15.625 11.875H13.125V6.87503H15.625C16.288 6.87503 16.9239 7.13842 17.3928 7.60726C17.8616 8.0761 18.125 8.71198 18.125 9.37503C18.125 10.0381 17.8616 10.674 17.3928 11.1428C16.9239 11.6116 16.288 11.875 15.625 11.875Z" fill="#2989C5" />
                        </svg>
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
                    <div className={styles.textContainer2}>
                      <p className={styles.countText}>本月生日會員</p>
                      <p className={styles.BigcountText}>{stats?.birthday_members_count}</p>
                      <p className={styles.sendLink}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M19.375 9.37503C19.374 8.38078 18.9785 7.42755 18.2755 6.72452C17.5725 6.02148 16.6192 5.62606 15.625 5.62503H12.5156C12.2883 5.61174 8.32656 5.33284 4.55391 2.16878C4.37172 2.01577 4.14966 1.91793 3.9138 1.88676C3.67794 1.85558 3.43809 1.89236 3.22241 1.99278C3.00673 2.09319 2.82418 2.25307 2.69622 2.45363C2.56825 2.6542 2.50018 2.88712 2.5 3.12503V15.625C2.50003 15.863 2.568 16.096 2.6959 16.2967C2.82381 16.4974 3.00635 16.6574 3.22205 16.7579C3.43776 16.8584 3.67768 16.8953 3.91361 16.8641C4.14954 16.833 4.37167 16.7351 4.55391 16.5821C7.50469 14.1071 10.5695 13.3977 11.875 13.1992V15.6774C11.8747 15.8833 11.9254 16.0862 12.0224 16.2679C12.1195 16.4496 12.2599 16.6045 12.4312 16.7188L13.2906 17.2914C13.4567 17.4023 13.647 17.4718 13.8454 17.494C14.0439 17.5162 14.2448 17.4906 14.4313 17.4192C14.6178 17.3478 14.7845 17.2328 14.9175 17.0837C15.0504 16.9347 15.1457 16.756 15.1953 16.5625L16.1148 13.0969C17.017 12.9769 17.8448 12.5333 18.4445 11.8487C19.0441 11.1642 19.3748 10.2851 19.375 9.37503ZM3.75 15.6196V3.12503C7.09453 5.93049 10.518 6.64065 11.875 6.81565V11.9313C10.5195 12.1094 7.09688 12.818 3.75 15.6196ZM13.9844 16.2446V16.2531L13.125 15.6805V13.125H14.8125L13.9844 16.2446ZM15.625 11.875H13.125V6.87503H15.625C16.288 6.87503 16.9239 7.13842 17.3928 7.60726C17.8616 8.0761 18.125 8.71198 18.125 9.37503C18.125 10.0381 17.8616 10.674 17.3928 11.1428C16.9239 11.6116 16.288 11.875 15.625 11.875Z" fill="#2989C5" />
                        </svg>
                        {/* <a href="/dashboard/broadcast_setting?openModal=true">傳送廣播</a> */}
                        <Button type="link" icon={<FormOutlined />} onClick={handleSendBroadcast}>
                          傳送廣播
                        </Button>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>

        <Search
          placeholder="輸入關鍵字"
          allowClear
          onSearch={onSearch}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <div>
          <Button type="primary" onClick={() => setIsModalVisible(true)} className={styles.customButton}>
            <PlusCircleOutlined style={{ fontSize: '16px', marginRight: '5px' }} /> 新增會員
          </Button>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </div>
      </div>

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
              label={<span className={styles.Modalfont}>會員姓名</span>}
              rules={[{ required: true, message: 'Please enter the member name' }]}
              style={{ marginBottom: '0px' }}
            >
              <Input className={styles.ModalItem} placeholder="輸入姓名" />

            </Form.Item>
            <Form.Item
              name="member_phone"
              label={<span className={styles.Modalfont}>電話號碼</span>}
              rules={[{ required: true, message: 'Please enter the phone number' }]}
              style={{ marginBottom: '0px' }}
            >
              <Input className={styles.ModalItem} placeholder="輸入電話號碼" />
            </Form.Item>

            <Form.Item label={<span className={styles.Modalfont}>生日</span>} style={{ marginBottom: '0px' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                <Form.Item name="year" noStyle><Input placeholder="年" maxLength={4} style={{ width: '30%' }} className={styles.ModalItem} /></Form.Item>
                <Form.Item name="month" noStyle><Input placeholder="月" maxLength={2} style={{ width: '30%' }} className={styles.ModalItem} /></Form.Item>
                <Form.Item name="day" noStyle><Input placeholder="日" maxLength={2} style={{ width: '30%' }} className={styles.ModalItem} /></Form.Item>
              </div>
            </Form.Item>
          </div>

          <Form.Item
            name="referrer_phone"
            label={<span className={styles.Modalfont}>推薦人號碼</span>}
            rules={[{ required: false, message: 'Please enter the referrer phone number' }]}
            className={styles.referrerField}
          >
            <Input className={styles.ModalItem} />
          </Form.Item>

          {/* Uncomment if you want to include initial points */}
          {/* <Form.Item
            name="point"
            label="會員積分"
            rules={[{ required: true, message: 'Please enter the initial point' }]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item style={{ marginBottom: '0px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)} className={`${styles.CancelButton}`} style={{ marginRight: '10px' }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={addingMember} className={styles.addButton}>
                新增
              </Button>
            </div>
          </Form.Item>
        </Form>

      </Modal>
    </div >

  );
};

export default GetMemberListPage;