import { Button, Form, Input, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import EditModal from "./components/EditModal";
import ViewModal from "./components/ViewModal";
import { useSearchParams } from "react-router-dom";
import {
  useGetCustomerProfileQuery,
  useDeleteCustomerMutation,
  useUpdateCustomerStatusMutation,
  useLazyExportCustomersQuery,
} from "../../redux/apiSlices/customerSlice";
import CustomerTableColumn from "./components/CustomerTableColumn";

const CustomerManagement2 = () => {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [form] = Form.useForm();

  const queryParams = [
    { name: "page", value: page },
    { name: "limit", value: limit },
  ];
  if (searchText.trim()) {
    queryParams.push({ name: "searchTerm", value: searchText.trim() });
  }

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetCustomerProfileQuery(queryParams);

  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const [updateCustomerStatus, { isLoading: isUpdatingStatus }] =
    useUpdateCustomerStatusMutation();

  const [triggerExport, { isLoading: isExportLoading }] =
    useLazyExportCustomersQuery();

  const handleExportCustomers = async () => {
    try {
      const result = await triggerExport([]);

      if (result.data) {
        // Create a blob URL and trigger download
        const blob = result.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Generate filename with current date
        const dateStr = new Date().toISOString().split("T")[0];
        link.download = `customers-export-${dateStr}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Failed to export customers");
    }
  };

  console.log(response);

  const tableData = useMemo(() => {
    const items = response?.data || [];
    return items.map((item, index) => ({
      key: item._id,
      recordId: item._id,
      id: index + 1 + (page - 1) * limit,
      customerId: item.customUserId || "-",
      customerName: item.firstName || "-",
      subscription: item.subscription || "-",
      tier: item.tier,
      phone: item.phone || "-",
      email: item.email || "-",
      location: item.address || "-",
      refdRep: item?.referredInfo?.referredBy || "-",
      totalSales: item.totalSales || 0,
      status: item.status === "active" ? "Active" : "Inactive",
      raw: item,
    }));
  }, [response, page, limit]);

  const paginationData = {
    pageSize: limit,
    total: response?.pagination?.total || 0,
    current: page,
  };

  const handlePaginationChange = (newPage, newPageSize) => {
    setPage(newPage);
    if (newPageSize !== limit) {
      setLimit(newPageSize);
    }
  };

  const editFields = [
    {
      name: "customerName",
      label: "Customer Name",
      rules: [{ required: true }],
    },
    { name: "email", label: "Email Address", rules: [{ required: true }] },
    {
      name: "subscription",
      label: "Subscription Type",
      rules: [{ required: true }],
    },
    { name: "tier", label: "Tier", rules: [{ required: true }] },
    { name: "lastPaymentDate", label: "Last Payment Date", type: "date" },
    { name: "expiryDate", label: "Expiry Date", type: "date" },
  ];

  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      customerName: record.customerName,
      email: record.email,
      subscription: record.subscription,
      tier: record.tier,
      lastPaymentDate: record.lastPaymentDate
        ? dayjs(record.lastPaymentDate)
        : null,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
    });
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedRecord(null);
  };

  const handleEditSubmit = (values) => {
    const updatedRecord = { ...selectedRecord, ...values };
    setTableData((prev) =>
      prev.map((item) => (item.id === selectedRecord.id ? updatedRecord : item))
    );
    setIsEditModalVisible(false);
    form.resetFields();
    Swal.fire("Updated!", "The customer details were updated.", "success");
  };

  const handleDelete = async (recordId) => {
    const target = response?.data?.find((c) => c._id === recordId);

    Swal.fire({
      title: "Delete customer?",
      text: `This will remove ${target?.firstName || "this customer"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deleteCustomer(recordId).unwrap();
        Swal.fire("Deleted!", "Customer has been deleted.", "success");
      } catch (err) {
        console.error("Delete customer failed", err);
        Swal.fire(
          "Error!",
          err?.data?.message || "Failed to delete customer",
          "error"
        );
      }
    });
  };

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      const statusValue = newStatus === "Active" ? "active" : "inActive";
      await updateCustomerStatus({
        id: recordId,
        status: statusValue,
      }).unwrap();
      Swal.fire({
        title: "Updated!",
        text: `Status has been changed to ${newStatus}.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Status update failed", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to update status.",
      });
    }
  };

  // Sync URL params with state
  useEffect(() => {
    const params = {};

    params.page = page;
    params.limit = limit;

    if (searchText.trim()) {
      params.searchTerm = searchText.trim();
    }

    setSearchParams(params);
  }, [page, limit, searchText]);

  useEffect(() => {
    const urlPage = searchParams.get("page");
    const urlSearch = searchParams.get("searchTerm");

    if (urlPage) setPage(Number(urlPage));
    if (urlSearch) setSearchText(urlSearch);
  }, []);

  const datailsColumns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Subscription Type",
      dataIndex: "subscription",
      key: "subscription",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "Reward",
      dataIndex: "reward",
      key: "reward",
      align: "center",
    },
    {
      title: "Points Used",
      dataIndex: "pointsUsed",
      key: "pointsUsed",
      align: "center",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between flex-col md:flex-row gap-0 items-start md:items-end">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 ">
          <div>
            <h1 className="text-[24px] font-bold">Customer Profile</h1>
            <p className="text-[16px] font-normal">
              Seamlessly manage customer profiles and interactions.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Search by Customer ID, Name, Phone or Email, Location"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-96"
          />
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            onClick={handleExportCustomers}
            loading={isExportLoading}
            disabled={isExportLoading}
          >
            Export
          </Button>
        </div>
      </div>

      <CustomerTableColumn
        data={tableData}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={paginationData}
        onView={showViewModal}
        onEdit={showEditModal}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onPaginationChange={handlePaginationChange}
      />

      {/* View Details Modal */}
      <ViewModal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        selectedRecord={selectedRecord}
        columns2={datailsColumns}
        data={tableData}
      />

      {/* Edit Customer Modal */}
      <EditModal
        visible={isEditModalVisible}
        title="Edit Customer"
        onCancel={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        form={form}
        selectedRecord={selectedRecord}
        fields={editFields}
      />
    </div>
  );
};

export default CustomerManagement2;
