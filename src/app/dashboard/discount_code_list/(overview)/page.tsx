// src/app/dashboard/discount_code_list/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Switch,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  message,
  Spin,
  Alert,
  DatePicker,
  Menu,
  Dropdown,
} from "antd";
const { Search } = Input;

import type { TableColumnsType, TableProps, MenuProps } from "antd";
import {
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  DownOutlined,
  UserOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import Link from "next/link";

import { useRouter } from "next/navigation";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface DiscountCode {
  key: number;
  discount_code_id: number;
  discount_code_name: string;
  discount_code: string;
  discount_type: "fixed_amount" | "percentage";
  discount_amount?: number;
  discount_percentage?: number;
  minimum_spending: number;
  fixed_discount_cap?: number;
  use_limit_type: "single_use" | "once_per_customer" | "unlimited";
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
  discount_code_status: "expired" | "active" | "suspended" | "scheduled";
  discount_code_content: string;
  discount_code_term: string;
}

const DiscountCodeListPage: React.FC = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [addingItem, setAddingItem] = useState<boolean>(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState<
    "fixed_amount" | "percentage"
  >("fixed_amount");

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const [discountTypes, setDiscountTypes] = useState<string[]>([]);
  const [useLimitTypes, setUseLimitTypes] = useState<string[]>([]);
  const [discountCodeStatuses, setDiscountCodeStatuses] = useState<string[]>(
    []
  );

  const [searchText, setSearchText] = useState<string>(""); // State for search text

  const router = useRouter();
  // const handleEdit = (record: DiscountCode) => {
  //   console.log(record.discount_code_id)
  //   router.push(`/dashboard/discount_code_list/${record.discount_code_id}/edit`);
  // };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // Row selection configuration
  const rowSelection: TableRowSelection<DiscountCode> = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const handleBulkMenuClick = async (e: { key: string }) => {
    const action = e.key; // 'enable', 'suspend', or 'delete'
    const selectedDiscountCodes = discountCodes.filter((item) =>
      selectedRowKeys.includes(item.key)
    );

    if (selectedDiscountCodes.length === 0) {
      message.warning("Please select at least one discount code.");
      return;
    }

    Modal.confirm({
      title: `Are you sure you want to ${action} the selected discount codes?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          if (action === "delete") {
            // Perform delete action
            await Promise.all(
              selectedDiscountCodes.map(async (discountCode) => {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/discount_code/delete_discount_code/${discountCode.discount_code_id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ deleted_status: true }),
                  }
                );
                if (!response.ok) {
                  throw new Error(
                    `Failed to delete discount code: ${response.status}`
                  );
                }
              })
            );
            // Remove deleted items from the state
            setDiscountCodes((prevDiscountCodes) =>
              prevDiscountCodes.filter(
                (item) => !selectedRowKeys.includes(item.key)
              )
            );
            message.success("Selected discount codes deleted successfully.");
          } else {
            // For 'enable' and 'suspend' actions
            const actionVerb = action === "enable" ? "enable" : "suspend";
            await Promise.all(
              selectedDiscountCodes.map(async (discountCode) => {
                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/discount_code/put_discount_code_is_active/${discountCode.discount_code_id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ action: actionVerb }),
                  }
                );
                if (!response.ok) {
                  throw new Error(
                    `Failed to ${actionVerb} discount code: ${response.status}`
                  );
                }
              })
            );
            // Update the status in the state
            setDiscountCodes((prevDiscountCodes) =>
              prevDiscountCodes.map((item) => {
                if (selectedRowKeys.includes(item.key)) {
                  // Update discount_code_status
                  let newStatus = item.discount_code_status;
                  if (action === "suspend") {
                    newStatus = "suspended";
                  } else if (action === "enable") {
                    newStatus = "active";
                  }
                  return {
                    ...item,
                    discount_code_status: newStatus,
                  };
                }
                return item;
              })
            );
            message.success(
              `Selected discount codes ${actionVerb}d successfully.`
            );
          }
          // Clear selection
          setSelectedRowKeys([]);
        } catch (error: any) {
          console.error(`Error performing bulk ${action}:`, error);
          message.error(`Failed to perform bulk ${action}: ${error.message}`);
        }
      },
    });
  };

  const fetchDiscountCodes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/discount_code/get_discount_code_list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.status === 404) {
        // No discount codes found, initialize with empty array
        setDiscountCodes([]);
      } else if (!response.ok) {
        throw new Error(`Failed to fetch discount codes: ${response.status}`);
      } else {
        const responseData = await response.json();
        const discountCodesArray: DiscountCode[] = responseData.discount_codes;

        // Map data to include 'key' property required by Ant Design Table
        const formattedData = discountCodesArray.map((item) => ({
          ...item,
          key: item.discount_code_id,
        }));
        setDiscountCodes(formattedData);

        // Set filter data
        setDiscountTypes(responseData.discount_types || []);
        setUseLimitTypes(responseData.use_limit_types || []);
        setDiscountCodeStatuses(responseData.discount_code_status || []);
      }
    } catch (error: any) {
      console.error("Error fetching discount codes:", error);
      setError(error.message);
      message.error(`Error fetching discount codes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing discount codes on component mount
  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  // For Discount Type Filters
  const discountTypeFilters = discountTypes.map((type) => ({
    text: type,
    value: type,
  }));

  // For Use Limit Type Filters
  const useLimitTypeFilters = useLimitTypes.map((type) => ({
    text: type,
    value: type,
  }));

  // For Discount Code Status Filters
  const discountCodeStatusFilters = discountCodeStatuses.map((status) => ({
    text: status,
    value: status,
  }));

  // Search function
  const onSearch = (value: string) => {
    setSearchText(value.trim().toLowerCase());
  };

  // Filtered data based on searchText
  const filteredDiscountCodes = discountCodes.filter(
    (item) =>
      item.discount_code_name.toLowerCase().includes(searchText) ||
      String(item.discount_code).toLowerCase().includes(searchText)
  );

  // Table columns
  const columns: TableColumnsType<DiscountCode> = [
    {
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (_: any, record: DiscountCode) => (
        <Link
          href={`/dashboard/discount_code_list/${record.discount_code_id}/edit`}
        >
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
      title: "優惠名稱",
      dataIndex: "discount_code_name",
      key: "discount_code_name",
      render: (text: string, record: DiscountCode) => (
        <Link
          href={`/dashboard/discount_code_list/${record.discount_code_id}/edit`}
        >
          <span
            style={{
              color: "#1890ff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {text}
          </span>
        </Link>
      ),
    },
    {
      title: "優惠碼",
      dataIndex: "discount_code",
      key: "discount_code",
      // sorter: (a, b) => a.discount_code.localeCompare(b.discount_code),
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: "類別",
      dataIndex: "discount_type",
      key: "discount_type",
      // sorter: true,
      filters: discountTypeFilters,
      onFilter: (value, record) => record.discount_type === value,
      render: (text) => (
        <div className="custom-row-style">
          {text === "fixed_amount" ? "Fixed Amount" : "Percentage"}
        </div>
      ),
    },
    {
      title: "折扣額",
      key: "discount_amount",
      sorter: (a, b) => {
        // If both are fixed_amount, compare discount_amount
        if (
          a.discount_type === "fixed_amount" &&
          b.discount_type === "fixed_amount"
        ) {
          return (a.discount_amount ?? 0) - (b.discount_amount ?? 0);
        }
        // If one is fixed_amount and the other is percentage, decide which comes first
        if (a.discount_type === "fixed_amount") return -1; // Put fixed_amount first
        if (b.discount_type === "fixed_amount") return 1; // Put fixed_amount first
        // If both are percentage, compare discount_percentage
        return (a.discount_percentage ?? 0) - (b.discount_percentage ?? 0);
      },
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_: any, record: DiscountCode) =>
        record.discount_type === "fixed_amount"
          ? `$${record.discount_amount}`
          : `${record.discount_percentage}%`,
    },
    {
      title: "最低消費",
      dataIndex: "minimum_spending",
      key: "minimum_spending",
      // sorter: true, // Enable server-side sorting
      sorter: (a, b) => a.minimum_spending - b.minimum_spending,
      sortDirections: ["ascend", "descend", "ascend"],
      render: (text) => `$${text}`,
    },
    {
      title: "開始日期",
      dataIndex: "valid_from",
      key: "valid_from",
      sorter: (a, b) =>
        new Date(a.valid_from || "").getTime() -
        new Date(b.valid_from || "").getTime(),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (text) =>
        text
          ? new Date(text).toISOString().slice(0, 10)
          : "--",
    },
    {
      title: "到期日",
      dataIndex: "valid_until",
      key: "valid_until",
      sorter: (a, b) =>
        new Date(a.valid_until || "").getTime() -
        new Date(b.valid_until || "").getTime(),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (text) =>
        text
          ? new Date(text).toISOString().slice(0, 10)
          : "--",
    },

    {
      title: "使用限制",
      dataIndex: "use_limit_type",
      key: "use_limit_type",
      filters: useLimitTypeFilters,
      onFilter: (value, record) => record.use_limit_type === value,
      render: (text) => <div className="custom-row-style">{text}</div>,
    },
    {
      title: "狀態",
      dataIndex: "discount_code_status",
      key: "discount_code_status",
      filters: discountCodeStatusFilters,
      onFilter: (value, record) => record.discount_code_status === value,
      render: (status: string) => {
        let color;
        if (status === "active") {
          color = "green";
        } else if (status === "expired") {
          color = "red";
        } else if (status === "scheduled") {
          color = "orange";
        } else {
          color = "gray";
        }

        return (
          <span>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: color,
                marginRight: 8,
              }}
            />
            {status}
          </span>
        );
      },
    },
  ];

  const showModal = () => {
    setSelectedDiscountType("fixed_amount"); // Default type
    // form.resetFields();
    setIsEditing(false);
    setEditingItemId(null);
    setIsModalVisible(true);
  };

  const handleDiscountTypeChange = (value: "fixed_amount" | "percentage") => {
    setSelectedDiscountType(value);
    form.resetFields(); // Reset fields when discount type changes
    form.setFieldsValue({ discount_type: value });
  };

  const onFinish = async (values: any) => {
    // Build the discount code object
    const newItem: Partial<DiscountCode> = {
      discount_code_name: values.discount_code_name,
      discount_code: values.discount_code,
      discount_type: selectedDiscountType,
      minimum_spending: values.minimum_spending,
      use_limit_type: values.use_limit_type,
      valid_from: values.valid_from ? values.valid_from.toISOString() : null,
      valid_until: values.valid_until ? values.valid_until.toISOString() : null,
      discount_code_content: values.discount_code_content,
      discount_code_term: values.discount_code_term,
    };

    if (selectedDiscountType === "fixed_amount") {
      newItem.discount_amount = values.discount_amount;
      newItem.discount_percentage = undefined;
      newItem.fixed_discount_cap = undefined;
    } else if (selectedDiscountType === "percentage") {
      newItem.discount_percentage = values.discount_percentage;
      newItem.fixed_discount_cap = values.fixed_discount_cap;
      newItem.discount_amount = undefined;
    }

    try {
      setAddingItem(true);

      let response;

      if (isEditing && editingItemId !== null) {
        // Update existing discount code
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/discount_code/update_discount_code/${editingItemId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(newItem),
          }
        );
      } else {
        // Add new discount code
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/discount_code/post_new_discount_code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ ...newItem, is_active: true }),
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditing ? "update" : "add"} discount code: ${
            response.status
          }`
        );
      }

      const result = await response.json();

      if (isEditing && editingItemId !== null) {
        // Update the item in the state
        setDiscountCodes((prevItems) =>
          prevItems.map((item) =>
            item.discount_code_id === editingItemId
              ? { ...item, ...result }
              : item
          )
        );
        message.success("Discount code updated successfully!");
      } else {
        // Add the new item to the state
        setDiscountCodes((prevItems) => [
          ...prevItems,
          { ...result, key: result.discount_code_id },
        ]);
        message.success("Discount code added successfully!");
      }

      setIsModalVisible(false);
      setIsEditing(false);
      setEditingItemId(null);
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} discount code:`,
        error
      );
      message.error(
        `Failed to ${isEditing ? "update" : "add"} discount code: ${
          error.message
        }`
      );
    } finally {
      setAddingItem(false);
    }
    fetchDiscountCodes();
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/discount_code/delete_discount_code/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ deleted_status: true }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.status}`);
      }

      // Remove the item from the state
      setDiscountCodes((prevItems) =>
        prevItems.filter((item) => item.discount_code_id !== id)
      );
      message.success("Item deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting item:", error);
      message.error(`Failed to delete item: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin tip="Loading..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  const items: MenuProps["items"] = [
    {
      label: "Delete",
      key: "1",
      icon: <UserOutlined />,
    },
    {
      label: "Enable",
      key: "2",
      icon: <UserOutlined />,
    },
    {
      label: "Suspend",
      key: "3",
      icon: <UserOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items,
    // onClick: handleMenuClick,
  };

  return (
    <div>
      <div className="promotion-summary">
        <div className="promotion-item">
          <img
            src="/promotion.png"
            alt="Promotion"
            className="promotion-image"
          />
          <div className="promotion-content">
            <div className="promotion-text">有效優惠</div>
            <div className="promotion-number">5</div>
          </div>
        </div>

        <div className="promotion-item">
          <img src="/pending.png" alt="Pending" className="promotion-image" />
          <div className="promotion-content">
            <div className="promotion-text">預定優惠</div>
            <div className="promotion-number">8</div>
          </div>
        </div>

        <Button
          onClick={() =>
            router.push("/dashboard/discount_code_list/deleted_discount_code")
          }
          className="custom-button"
        >
          <span className="button-text">檢視垃圾桶</span>
          <DeleteOutlined className="button-icon" />
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
          onSearch={onSearch}
          style={{ width: 232 }}
        />

        <Button type="primary" onClick={showModal} className="customButton">
          <PlusCircleOutlined
            style={{ fontSize: "16px", marginRight: "5px" }}
          />{" "}
          新增優惠
        </Button>
      </div>

      <Table
        className="custom-table-header"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredDiscountCodes}
        rowKey="discount_code_id"
        style={{ marginTop: 16 }}
        locale={{ emptyText: "No discount codes found." }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

      {/* Modal Form */}
      <Modal
        title={
          <div className="modalTitle">
            <img src="/coupon.png" alt="Icon" style={{ width: "24px" }} />
            <span className="BigcountText">新增優惠</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setIsEditing(false);
          setEditingItemId(null);
        }}
        footer={null}
        width={1000}
        style={{ maxWidth: "90%", height: "auto", top: 20 }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <div className="two-column-form">
          <div className="form-left">
            <Form.Item
              name="discount_code_name"
              label={<span className="form-item-label">優惠名稱</span>}
              rules={[
                {
                  required: true,
                  message: "Please enter the discount code name",
                },
              ]}
            >
              <Input className="form-input" placeholder="輸入優惠名稱" />
            </Form.Item>

            <Form.Item
              name="discount_code"
              label={<span className="form-item-label">優惠碼</span>}
              rules={[
                { required: true, message: "Please enter the discount code" },
              ]}
            >
              <Input className="form-input" placeholder="輸入優惠碼" />
            </Form.Item>

            <Form.Item
              name="discount_code_content"
              label={<span className="form-item-label">優惠詳情</span>}
              rules={[{ required: true, message: "輸入禮物詳情" }]}
            >
              <TextArea
                className="form-input"
                placeholder="輸入優惠詳情"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>

            <Form.Item
              name="discount_code_term"
              label={<span className="form-item-label">條款及細則</span>}
              rules={[{ required: true, message: "輸入禮物的條款及細則" }]}
            >
              <TextArea
                className="form-input"
                style={{ marginBottom: "6px" }}
                placeholder="輸入禮物的條款及細則"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </div>

          <div className="form-right">
            <Form.Item
              name="discount_type"
              label={<span className="form-item-label">折扣類型</span>}
              initialValue={selectedDiscountType}
              rules={[
                { required: true, message: "Please select a discount type" },
              ]}
            >
              <Select
                onChange={handleDiscountTypeChange}
                className="custom-select"
              >
                <Option value="fixed_amount">固定金額</Option>
                <Option value="percentage">百分比</Option>
              </Select>
            </Form.Item>

            {selectedDiscountType === "fixed_amount" && (
              <Form.Item
                name="discount_amount"
                label={<span className="form-item-label">折扣金額</span>}
                rules={[
                  {
                    required: true,
                    message: "Please enter the discount amount",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="輸入折扣金額"
                  className="form-input"
                />
              </Form.Item>
            )}

            {selectedDiscountType === "percentage" && (
              <>
                <Form.Item
                  name="discount_percentage"
                  label={<span className="form-item-label">折扣比率</span>}
                  rules={[
                    {
                      required: true,
                      message: "Please enter the discount percentage",
                    },
                  ]}
                >
                  <InputNumber<number>
                    min={1}
                    max={100}
                    style={{ width: "100%" }}
                    formatter={(value) => `${value}%`}
                    parser={(value) =>
                      parseFloat(value!.replace("%", "") || "0")
                    }
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              name="minimum_spending"
              label={<span className="form-item-label">最低消費金額</span>}
              rules={[
                {
                  required: true,
                  message: "Please enter the minimum spending",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="最低消費金額"
                className="form-input"
              />
            </Form.Item>

            <Form.Item
              name="use_limit_type"
              label={<span className="form-item-label">使用限制</span>}
              rules={[
                { required: true, message: "Please select the use limit type" },
              ]}
            >
              <Select placeholder="選擇使用限制" className="custom-select">
                <Option value="single_use">此編號使用一次後失效</Option>
                <Option value="once_per_customer">每位客戶可使用一次</Option>
                <Option value="unlimited">沒有限制</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="valid_from"
              label={<span className="form-item-label">換領開始日期</span>}
              rules={[
                {
                  required: false,
                  message: "Please select the valid from date",
                },
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="選擇日期"
                style={{ width: "100%" }}
                className="form-input"
              />
            </Form.Item>

            <Form.Item
              name="valid_until"
              label={<span className="form-item-label">換領結束日期</span>}
              rules={[
                {
                  required: false,
                  message: "Please select the valid until date",
                },
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="選擇日期"
                style={{ width: "100%" }}
                className="form-input"
              />
            </Form.Item>
          </div>
          </div>
        <Form.Item style={{ marginBottom: "0px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                setIsModalVisible(false);
                setIsEditing(false);
                setEditingItemId(null);
              }}
              className="CancelButton"
              style={{ marginRight: "10px" }}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={addingItem}
              className="addButton"
            >
              儲存
            </Button>
          </div>
        </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DiscountCodeListPage;
