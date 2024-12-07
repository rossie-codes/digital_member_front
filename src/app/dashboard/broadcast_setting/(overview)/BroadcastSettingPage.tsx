// src/app/dashboard/broadcast_setting/(overview)/BroadcastSettingPage.tsx

"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  message,
  Dropdown,
  InputNumber,
  Popconfirm,
  Typography,
  Badge,
  Tag,
  Spin,
} from "antd";
import type { TableColumnsType, TableProps, PaginationProps } from "antd";
import {
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  UserOutlined,
  DownOutlined,
  FundViewOutlined,
  PlusCircleOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
const { Title } = Typography;

const { Search } = Input;

interface Broadcast {
  key: string;
  broadcast_id: number;
  broadcast_name: string;
  wati_template: string;
  scheduled_start: string;
  recipient_count: number;
}

interface BroadcastFetchParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
  filters?: any;
  broadcastSearchText?: string;
}

interface MemberFetchParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: string;
  filters?: any;
  memberSearchText?: string;
  modalMemberSearchText?: string;
}

interface WatiTemplate {
  id: string;
  name: string;
  // Include other relevant fields
}

interface Member {
  id: string;
  name: string;
  phone_number: string;
  membership_tier: string;
  membership_status: string;
  points_balance: number;
  referral_count: number;
  order_count: number;
}

const BroadcastSettingPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const openModal = searchParams.get("openModal") === "true";
  const memberIdsParam = searchParams.get("member_ids"); // Fetch member_ids from query

  const [broadcastData, setBroadcastData] = useState<Broadcast[]>([]);
  const [broadcastSearchText, setBroadcastSearchText] = useState<string>("");
  const showTotal: PaginationProps["showTotal"] = (total) =>
    `Total ${total} items`;

  const [broadcastCurrentPage, setBroadcastCurrentPage] = useState<number>(1);
  const [broadcastPageSize, setBroadcastPageSize] = useState<number>(10);
  const [broadcastTotalItems, setBroadcastTotalItems] = useState<number>(0);
  const [broadcastTotalRecipientCount, setBroadcastTotalRecipientCount] = useState<number>(0);

  // State variables for modal and form
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);
  const [broadcastForm] = Form.useForm(); // Form instance for the modal
  const [filterForm] = Form.useForm();

  // State variables for WATI templates
  const [watiTemplates, setWatiTemplates] = useState<WatiTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);

  const [selectedBroadcastRowKeys, setSelectedBroadcastRowKeys] = useState<
    React.Key[]
  >([]);
  const [selectedMemberRowKeys, setSelectedMemberRowKeys] = useState<
    React.Key[]
  >([]);

  // State variables for members
  const [modalMembers, setModalMembers] = useState<Member[]>([]);

  const [loadingModalMembers, setLoadingModalMembers] =
    useState<boolean>(false);
  const [modalMemberSearchText, setModalMemberSearchText] =
    useState<string>("");
  const [modalMemberFilters, setModalMemberFilters] = useState<any>({});
  const [memberCurrentPage, setModalCurrentPage] = useState<number>(1);
  const [memberPageSize, setModalPageSize] = useState<number>(10);
  const [memberTotalItems, setModalTotalItems] = useState<number>(0);

  const [selectedTemplateData, setSelectedTemplateData] = useState<any>(null);
  const [loadingTemplateData, setLoadingTemplateData] =
    useState<boolean>(false);

  // 要將各個 request 集合在一個 request，反正都是打開 modal 時發生
  const [membershipTierOptions, setMembershipTierOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (openModal) {
      setIsModalVisible(true);
      // Optionally, remove the query parameter after opening the modal
      router.replace("/dashboard/broadcast_setting");
    }
  }, [openModal, router]);

  useEffect(() => {
    if (memberIdsParam) {
      // Process member_ids as needed
      const member_ids = memberIdsParam.split(",").map((key) => key.toString());
      console.log("Member IDs for Broadcast:", member_ids);

      // Ensure that the data is loaded before setting selectedRowKeys
      // You can move this inside the fetchModalMembers after data is fetched
    }
  }, [memberIdsParam]);

  const fetchBroadcastData = async (
    params: BroadcastFetchParams = { page: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const {
        page,
        pageSize,
        sortField,
        sortOrder,
        filters,
        broadcastSearchText,
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (sortField) queryParams.append("sortField", sortField);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

      if (broadcastSearchText) {
        queryParams.append("broadcastSearchText", broadcastSearchText);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/broadcast_setting/get_broadcast_list?${queryParams.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      const broadcasts: any[] = jsonData.data;
      const total_broadcast: number = jsonData.total_broadcast;
      const total_recipient_count: number = jsonData.total_recipient_count;

      if (!Array.isArray(broadcasts)) {
        throw new Error(
          "Invalid data format: 'broadcasts' should be an array."
        );
      }

      const formattedData: Broadcast[] = broadcasts.map((broadcast: any) => ({
        key: broadcast.broadcast_id,
        broadcast_id: broadcast.broadcast_id,
        broadcast_name: broadcast.broadcast_name || "N/A",
        wati_template: broadcast.wati_template || "N/A",
        scheduled_start: broadcast.scheduled_start
          ? formatDate(broadcast.scheduled_start)
          : "N/A",
        recipient_count: broadcast.recipient_count || 0,
      }));

      setBroadcastData(formattedData);
      setBroadcastTotalItems(total_broadcast);
      setBroadcastTotalRecipientCount(total_recipient_count);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const broadcastRowSelection = {
    selectedBroadcastRowKeys,
    onChange: (
      newSelectedBroadcastRowKeys: React.Key[],
      selectedBroadcastRows: Broadcast[]
    ) => {
      setSelectedBroadcastRowKeys(newSelectedBroadcastRowKeys);
      // Optionally, you can also store the selectedRows for future use
    },
    // Uncomment below if you want to disable selection for certain rows

    // getCheckboxProps: (record: DataType) => ({
    //   disabled: record.name === 'Disabled Broadcast', // Disable checkbox for specific rows
    // }),
  };

  const memberRowSelection: TableProps<Member>["rowSelection"] = {
    selectedRowKeys: selectedMemberRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      const keysAsString = selectedRowKeys.map((key) => key.toString());
      setSelectedMemberRowKeys(keysAsString);
      console.log("Selected members:", keysAsString);
    },
    preserveSelectedRowKeys: true, // Add this property
  };

  const formatDate = (isoString: string): string => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Fetch data when component mounts
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBroadcastData({
        page: broadcastCurrentPage,
        pageSize: broadcastPageSize,
        broadcastSearchText: broadcastSearchText,
      });
    }
  }, [broadcastCurrentPage, broadcastPageSize, broadcastSearchText]);

  const onBroadcastSearch = (value: string) => {
    const trimmedValue = value.trim();
    setBroadcastSearchText(trimmedValue);

    // Reset pagination to the first page when a new search is performed
    setBroadcastCurrentPage(1);

    fetchBroadcastData({
      page: 1,
      pageSize: broadcastPageSize,
      broadcastSearchText: trimmedValue,
    });
  };

  const handleDelete = async (key: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/broadcast_setting/delete_broadcast/${key}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete broadcast: ${response.status}`);
      }

      message.success("Broadcast deleted successfully!");
      // Option 1: Refresh the table data
      fetchBroadcastData({
        page: broadcastCurrentPage,
        pageSize: broadcastPageSize,
        broadcastSearchText: broadcastSearchText,
      });

      // Option 2: Remove the deleted item from state
      // setBroadcastData(prevData => prevData.filter(item => item.key !== key));
    } catch (error: any) {
      console.error("Delete error:", error);
      message.error(`Error deleting broadcast: ${error.message}`);
    }
  };

  const broadcastColumns: TableColumnsType<Broadcast> = [
    {
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (_: any, record: Broadcast) => (
        <Link href={`/dashboard/broadcast_setting/${record.broadcast_id}/edit`}>
          <Button
            type="link"
            icon={
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
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
      title: "廣播名稱",
      dataIndex: "broadcast_name",
      key: "broadcast_name",
      render: (text: string, record: Broadcast) => (
        <Link href={`/dashboard/broadcast_setting/${record.broadcast_id}/edit`}>
          <span className="broadcast-name-text">{text}</span>
        </Link>
      ),
    },

    {
      title: "廣播範本",
      dataIndex: "wati_template",
      key: "wati_template",
      render: (text: string) => (
        <span className="broadcast-name-text">{text}</span>
      ),
    },
    {
      title: "預定發送時間",
      dataIndex: "scheduled_start",
      key: "scheduled_start",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text: string) => {
        const [datePart, timePart] = text.split(" ");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes] = timePart.split(":");

        const date = new Date(
          parseInt(year, 10),
          parseInt(month, 10) - 1,
          parseInt(day, 10),
          parseInt(hours, 10),
          parseInt(minutes, 10)
        );

        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        const formattedTime = `${String(date.getHours()).padStart(
          2,
          "0"
        )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
          date.getSeconds()
        ).padStart(2, "0")}`;
        return `${formattedDate} ｜${formattedTime}`;
      },
    },

    {
      title: "收件者數目",
      dataIndex: "recipient_count",
      key: "recipient_count",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text: number) => (
        <span className="custom-recipient-count">{text}</span>
      ),
    },
    {
      title: "",
      key: "",
      render: (_: any, record: Broadcast) => (
        <Popconfirm
          title="Are you sure to delete this broadcast?"
          onConfirm={() => handleDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="link"
            icon={<DeleteOutlined style={{ color: "#737277" }} />}
          />
        </Popconfirm>
      ),
      width: 50,
    },
  ];

  const handleBroadcastTableChange = (
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    setBroadcastCurrentPage(pagination.current);
    setBroadcastPageSize(pagination.pageSize);

    // Prepare sort parameters
    let sortField = sorter.field;
    let sortOrder = sorter.order;
    if (sortOrder) {
      sortOrder = sorter.order === "ascend" ? "ascend" : "descend";
    }

    // Fetch data based on the new pagination and sorting
    fetchBroadcastData({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sortField,
      sortOrder: sortOrder,
      broadcastSearchText: broadcastSearchText,
    });
  };

  const fetchModalMembers = async (
    params: MemberFetchParams = { page: 1, pageSize: 10 }
  ) => {
    setLoadingModalMembers(true);
    try {
      const {
        page,
        pageSize,
        sortField,
        sortOrder,
        filters,
        modalMemberSearchText,
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (sortField) queryParams.append("sortField", sortField);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

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
      if (modalMemberSearchText) {
        queryParams.append("modalMemberSearchText", modalMemberSearchText);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/broadcast_setting/get_broadcast_member_list?${queryParams.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      const members: any[] = jsonData.data;
      const total: number = jsonData.total;
      const watiTemplateList: WatiTemplate[] = jsonData.watiTemplateList.map(
        (template: any) => ({
          id: template,
          name: template,
        })
      );

      if (!Array.isArray(members)) {
        throw new Error("Invalid data format: 'members' should be an array.");
      }

      const formatDate = (isoString: string): string => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "Invalid Date";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const formattedData: Member[] = members.map((member: any) => ({
        key: member.member_id.toString(),
        id: member.member_id.toString(),
        name: member.member_name || "N/A",
        phone_number: member.member_phone || "N/A",
        membership_tier: member.membership_tier
          ? member.membership_tier.membership_tier_name
          : "N/A",
        membership_status: member.membership_status || "Unknown",
        points_balance: member.points_balance || 0,
        referral_count: member.referral_count || 0,
        order_count: member.order_count || 0,
      }));

      setWatiTemplates(watiTemplateList);
      setModalMembers(formattedData);
      setModalTotalItems(total);

      // Update membership tier options for filters if needed
      // ...
    } catch (err: any) {
      console.error("Fetch error:", err);
      message.error("Failed to fetch members.");
    } finally {
      setLoadingModalMembers(false);
      if (memberIdsParam) {
        const member_ids = memberIdsParam.split(",").map((id) => id.trim());
        setSelectedMemberRowKeys(member_ids);
      }
    }
  };

  const handleFilterApply = (values: any) => {
    setModalMemberFilters(values);
    setIsFilterModalVisible(false);
    fetchModalMembers({
      page: 1,
      pageSize: memberPageSize,
      filters: values,
      modalMemberSearchText: modalMemberSearchText,
    });
  };

  // Fetch WATI templates and members when modal opens
  useEffect(() => {
    if (isModalVisible) {
      fetchModalMembers({
        page: memberCurrentPage,
        pageSize: memberPageSize,
        filters: modalMemberFilters,
        modalMemberSearchText: modalMemberSearchText,
      });
    } else {
      // Reset form and selections when modal closes
      broadcastForm.resetFields();
      filterForm.resetFields();
      setSelectedMemberRowKeys([]); // Only reset when modal is closed
      setModalMemberSearchText("");
      setModalMemberFilters({});
      setModalCurrentPage(1);
      setModalPageSize(10);
    }
  }, [isModalVisible]);

  const handleWatiTemplateChange = async (templateId: string) => {
    setLoadingTemplateData(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/broadcast_setting/get_wati_template_detail/${templateId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch template details: ${response.status}`);
      }

      const data = await response.json();
      setSelectedTemplateData(data);

      // Optionally, update form fields with the fetched data
      broadcastForm.setFieldsValue({
        // Example: Assuming the fetched data has a 'description' field
        description: data.description || "",
        // Add other fields as needed
      });

      message.success("Template details loaded successfully!");
    } catch (error: any) {
      console.error("Error fetching template details:", error);
      message.error(`Error fetching template details: ${error.message}`);
    } finally {
      setLoadingTemplateData(false);
    }
  };

  const memberColumns: TableColumnsType<Member> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "電話",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "狀態",
      dataIndex: "membership_status",
      key: "membership_status",
      render: (status: string) => {
        // 狀態與顏色映射
        const statusColorMap: Record<string, string> = {
          active: "green",
          expired: "orange",
          suspended: "red",
        };

        // 狀態名稱映射
        const statusLabelMap: Record<string, string> = {
          active: "Active",
          expired: "Expired",
          suspended: "Suspended",
        };

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* 顏色圓點 */}
            <span
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: statusColorMap[status.toLowerCase()],
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
            {/* 狀態文字 */}
            <span>{statusLabelMap[status.toLowerCase()]}</span>
          </div>
        );
      },
    },
  ];

  const onModalMemberSearch = (value: string) => {
    const trimmedValue = value.trim().toLowerCase();
    setModalMemberSearchText(trimmedValue);

    // Reset pagination to the first page when a new search is performed
    setModalCurrentPage(1);

    fetchModalMembers({
      page: 1,
      pageSize: memberPageSize,
      filters: modalMemberFilters,
      modalMemberSearchText: trimmedValue,
    });
  };

  const handleModalMembersTableChange = (
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    setModalCurrentPage(pagination.current);
    setModalPageSize(pagination.pageSize);
    setModalMemberFilters(filters);

    // Prepare sort parameters
    let sortField = sorter.field;
    let sortOrder = sorter.order;
    if (sortOrder) {
      sortOrder = sorter.order === "ascend" ? "ascend" : "descend";
    }

    // Fetch data based on the new pagination, filters, and sorting
    fetchModalMembers({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sortField,
      sortOrder: sortOrder,
      filters: filters,
      modalMemberSearchText: modalMemberSearchText,
    });
  };

  const handleCreateBroadcast = async (values: any) => {
    const memberIds = selectedMemberRowKeys;

    if (memberIds.length === 0) {
      message.error("Please select at least one member.");
      return;
    }

    const dataToSubmit = {
      ...values,
      member_ids: memberIds,
    };

    try {
      // Submit broadcast creation (replace with actual API call)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/broadcast_setting/post_new_broadcast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );
      if (!response.ok) {
        throw new Error(`Error creating broadcast: ${response.status}`);
      }
      message.success("Broadcast created successfully");
      setIsModalVisible(false);
      // Refresh the list
      fetchBroadcastData({
        page: broadcastCurrentPage,
        pageSize: broadcastPageSize,
        broadcastSearchText: broadcastSearchText,
      });
    } catch (error) {
      console.error("Error creating broadcast:", error);
      message.error("Error creating broadcast");
    }
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Title className="broadcast_title">已編定時間等廣播</Title>
      <div className="promotion-summary">
        <div className="promotion-item">
          <img src="/pending.png" alt="Promotion" className="promotion-image" />
          <div className="promotion-content">
            <div className="promotion-text">預定廣播</div>
            <div className="promotion-number">{broadcastTotalItems}</div>
          </div>
        </div>

        <div className="promotion-item">
          <img src="/receiving.png" alt="Pending" className="promotion-image" />
          <div className="promotion-content">
            <div className="promotion-text">預計接受廣播人次</div>
            <div className="promotion-number">{broadcastTotalRecipientCount}</div>
          </div>
        </div>

        <Button
          onClick={() =>
            router.push("/dashboard/broadcast_setting/broadcast_history")
          }
          className="custom-button"
        >
          <span className="button-text">廣播歷史</span>
          <FundViewOutlined className="button-icon" />
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Search
          placeholder="輸入關鍵字"
          allowClear
          onSearch={onBroadcastSearch}
          onChange={(e) => setBroadcastSearchText(e.target.value)}
          style={{ width: 232 }}
        />
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="customButton"
        >
          <PlusCircleOutlined
            style={{ fontSize: "16px", marginRight: "5px" }}
          />{" "}
          新廣播
        </Button>
      </div>

      {/* Modal for New Broadcast */}
      <Modal
        title={
          <div className="modalTitle">
            <img src="/envelope.png" alt="Icon" style={{ width: "44px" }} />
            <span className="BigcountText">新廣播</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={null}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* 左側：表單區域 */}
          <div style={{ width: "60%", paddingRight: "16px" }}>
            <Form
              form={broadcastForm}
              layout="vertical"
              onFinish={handleCreateBroadcast}
            >
              {/* Broadcast Name */}
              <Form.Item
                label={<span className="form-label">廣播名稱</span>}
                name="broadcast_name"
                rules={[
                  {
                    required: true,
                    message: "Please input the broadcast name!",
                  },
                ]}
              >
                <Input placeholder="輸入廣播名稱" className="custom-input" />
              </Form.Item>

              {/* Template Message Selection */}
              <Form.Item
                name="wati_template"
                label={<span className="form-label">訊息範本</span>}
                rules={[
                  { required: true, message: "Please select a WATI template" },
                ]}
              >
                <Select
                  loading={loadingTemplates}
                  onChange={handleWatiTemplateChange} // Add this line
                  placeholder="選擇一個訊息範本"
                  className="custom-select"
                >
                  {watiTemplates.map((template) => (
                    <Select.Option key={template.id} value={template.id}>
                      {template.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Schedule Type */}
              <Form.Item
                label={<span className="form-label">發送時間</span>}
                name="schedule_type"
                rules={[
                  { required: true, message: "Please select a schedule type!" },
                ]}
              >
                <Radio.Group>
                  <Radio value="now" className="custom-radio">
                    現在發送
                  </Radio>
                  <Radio value="later" className="custom-radio">
                    安排特定時間發送
                  </Radio>
                </Radio.Group>
              </Form.Item>

              {/* Conditional Scheduled Time */}
              <Form.Item
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.schedule_type !== currentValues.schedule_type
                }
              >
                {({ getFieldValue }) => {
                  return getFieldValue("schedule_type") === "later" ? (
                    <Form.Item
                      label={<span className="form-label">預定時間</span>}
                      name="scheduled_time"
                      rules={[
                        {
                          required: true,
                          message: "Please select a scheduled time!",
                        },
                      ]}
                    >
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: "100%" }}
                        disabledDate={(current) =>
                          current &&
                          dayjs(current).isBefore(dayjs().startOf("day"))
                        }
                      />
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>

              {/* Member Selection */}

              <div
                style={{
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0px" }}
                >
                  <Input.Search
                    placeholder="輸入關鍵字"
                    value={modalMemberSearchText}
                    onChange={(e) => setModalMemberSearchText(e.target.value)}
                    onSearch={(value, event) => {
                      event?.preventDefault(); // Prevent form submission
                      onModalMemberSearch(value);
                    }}
                    enterButton={
                      <Button
                        className="custom-search-button"
                        htmlType="button"
                      >
                        <SearchOutlined />
                      </Button>
                    }
                    style={{ width: 300 }}
                    onPressEnter={(e) => {
                      e.preventDefault(); // Prevent form submission on Enter key press
                      onModalMemberSearch(modalMemberSearchText);
                    }}
                  />
                  <Button
                    className="filter-button"
                    style={{
                      width: "25px",
                      height: "25px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "7px",
                    }}
                    onClick={() => setIsFilterModalVisible(true)}
                  >
                    <FilterOutlined
                      style={{ fontSize: "25px", color: "#737277" }}
                    />
                  </Button>
                </div>
                {selectedMemberRowKeys.length >= 0 && (
                  <div style={{ textAlign: "right" }}>
                    已選：
                    <span style={{ color: "blue", fontWeight: "bold" }}>
                      {selectedMemberRowKeys.length} 聯絡人
                    </span>
                  </div>
                )}
              </div>

              <Table
                className="custom-table-header"
                dataSource={modalMembers}
                columns={memberColumns}
                rowKey="id"
                rowSelection={memberRowSelection}
                loading={loadingModalMembers}
                pagination={{
                  current: memberCurrentPage,
                  pageSize: 5,
                  total: memberTotalItems,
                  showTotal: (total) => `Total ${total} items`,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  position: ["bottomRight"],
                }}
                onChange={handleModalMembersTableChange}
              />
            </Form>
          </div>

          {/* 右側：動態預覽區域 */}
          <div className="previewWrapper">
            <div className="previewHeader">
              <h3>預覽</h3>
            </div>

            <div className="previewContent">
              <div className="imageContainer">
                <img
                  src="/phone.png"
                  alt="Preview Background"
                  className="previewImage"
                />
                <div className="messageBox">
                  {loadingTemplateData ? (
                    <Spin />
                  ) : selectedTemplateData ? (
                    <div>
                      <p>{selectedTemplateData.body.replace("{{1}}")}</p>
                      {selectedTemplateData.footer && (
                        <p>{selectedTemplateData.footer}</p>
                      )}
                    </div>
                  ) : (
                    <p>請選擇範本以預覽內容</p>
                  )}
                </div>
              </div>
            </div>

            <div className="previewFooter">
              {/* Submit Button */}

              <Form.Item>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => {
                      setIsModalVisible(false);
                    }}
                    className="CancelButton"
                    style={{ marginRight: "10px" }}
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => broadcastForm.submit()}
                    className="addButton"
                  >
                    儲存
                  </Button>
                </div>
              </Form.Item>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="Filter Members"
        open={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        footer={null}
      >
        <Form form={filterForm} layout="vertical" onFinish={handleFilterApply}>
          {/* Membership Tier Filter */}
          <Form.Item name="membership_tier" label="會員級別">
            <Select
              allowClear
              placeholder="Select Membership Tier"
              options={membershipTierOptions}
            />
          </Form.Item>
          {/* Membership Status Filter */}
          <Form.Item name="membership_status" label="Membership Status">
            <Select
              allowClear
              placeholder="Select Membership Status"
              options={[
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
                { value: "suspended", label: "Suspended" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="membership_expiry_date"
            label="會籍到期月份"
            rules={[{ required: false, message: "選擇日期" }]}
          >
            <DatePicker
              picker="month"
              format="YYYY-MM"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="birthday"
            label="生日月份"
            rules={[{ required: false, message: "選擇日期" }]}
          >
            <DatePicker picker="month" format="MM" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="created_at"
            label="加入日期"
            rules={[{ required: false, message: "選擇日期" }]}
          >
            <DatePicker
              // showTime
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* Points Balance Filter */}
          {/* <Form.Item name="points_balance" label="Points Balance">
            <InputNumber
              min={0}
              placeholder="Minimum Points Balance"
              style={{ width: "100%" }}
            />
          </Form.Item> */}
          {/* Referral Count Filter */}
          {/* <Form.Item name="referral_count" label="Count of Referrals">
            <InputNumber
              min={0}
              placeholder="Minimum Referrals"
              style={{ width: "100%" }}
            />
          </Form.Item> */}
          {/* Order Count Filter */}
          {/* <Form.Item name="order_count" label="Count of Orders">
            <InputNumber
              min={0}
              placeholder="Minimum Orders"
              style={{ width: "100%" }}
            />
          </Form.Item> */}
          {/* Apply and Clear Buttons */}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                filterForm.resetFields();
              }}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Existing Table */}
      <Table
        className="custom-table-header"
        rowSelection={broadcastRowSelection}
        dataSource={broadcastData}
        columns={broadcastColumns}
        style={{ marginTop: 16 }}
        locale={{ emptyText: "No broadcasts found." }}
        pagination={{
          current: broadcastCurrentPage,
          pageSize: broadcastPageSize,
          total: broadcastTotalItems,
          showTotal: showTotal,
          showSizeChanger: true,
          showQuickJumper: true,
          position: ["bottomRight"],
        }}
        loading={loading}
        onChange={handleBroadcastTableChange}
      />
    </div>
  );
};

export default BroadcastSettingPage;
