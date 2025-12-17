import { Button, Form, Input, message } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import AddEditModal from "./components/AddEditModal";
import ViewModal from "./components/ViewModal";
import {
  useGetMerchantProfileQuery,
  useDeleteMerchantMutation,
  useUpdateMerchantApprovalStatusMutation,
  useUpdateMerchantStatusMutation,
} from "../../redux/apiSlices/merchantSlice";
import MerchantTableColumn from "./components/MerchantTableColumn";

const MerchantManagement = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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
  } = useGetMerchantProfileQuery(queryParams);

  const [deleteMerchant, { isLoading: isDeleting }] =
    useDeleteMerchantMutation();
  const [updateApprovalStatus, { isLoading: isUpdatingApproval }] =
    useUpdateMerchantApprovalStatusMutation();
  const [updateMerchantStatus, { isLoading: isUpdatingStatus }] =
    useUpdateMerchantStatusMutation();

  console.log(response);

  const tableData = useMemo(() => {
    const items = response?.data || [];
    return items.map((item, index) => ({
      key: item._id,
      recordId: item._id,
      sl: index + 1 + (page - 1) * limit,
      merchantCardId: item.customUserId || "-",
      businessName: item.businessName || "-",
      phone: item.phone || "-",
      email: item.email || "-",
      location: item.address || "-",
      salesRep: item.salesRep || "-",
      totalSales: item.totalSales || 0,
      totalPointsEarned: item.totalPointsEarned || 0,
      totalPointsRedeemed: item.totalPointsRedeemed || 0,
      totalPointsPending: item.totalPointsPending || 0,
      totalVisits: item.totalVisits || 0,
      status: item.status === "active" ? "Active" : "Inactive",
      ratings: item.ratings || 0,
      approveStatus: item.approveStatus || "pending",
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

  // View
  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  // Normalize date fields (Dayjs -> "YYYY-MM-DD")
  const toISODate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : null);

  const handleAddMerchant = () => {
    form
      .validateFields()
      .then((values) => {
        const newMerchant = {
          id: data.length + 1,
          MarchantID: values.merchantName,
          email: values.email,
          subscriptionType: values.subscriptionType,
          lastPaymentDate: toISODate(values.lastPaymentDate),
          expiryDate: toISODate(values.expiryDate),
          tier: values.tier,
          sales: values.sales || "$0",
          status: values.status || "Pending",
          image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
          name: values.name || "—",
          businessName: values.businessName || "—",
          phone: values.phone || "—",
          location: values.address || "—",
          feedback: 0,
        };
        setData((prev) => [...prev, newMerchant]);
        setIsAddModalVisible(false);
        form.resetFields();
        message.success("New merchant added successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Update
  const handleUpdateMerchant = () => {
    form
      .validateFields()
      .then((values) => {
        const updated = {
          ...selectedRecord,
          MarchantID: values.merchantName,
          email: values.email,
          subscriptionType: values.subscriptionType,
          lastPaymentDate: toISODate(values.lastPaymentDate),
          expiryDate: toISODate(values.expiryDate),
          tier: values.tier,
        };
        setData((prev) =>
          prev.map((item) => (item.id === selectedRecord.id ? updated : item))
        );
        setIsEditModalVisible(false);
        form.resetFields();
        message.success("Merchant updated successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Add or Edit modal
  const showAddOrEditModal = (record = null) => {
    if (record) {
      setSelectedRecord(record);
      setIsViewModalVisible(false); // ✅ ensure the View modal is closed when editing
      form.setFieldsValue({
        merchantName: record.MarchantID,
        email: record.email,
        subscriptionType: record.subscriptionType,
        lastPaymentDate: record.lastPaymentDate
          ? dayjs(record.lastPaymentDate)
          : null,
        expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
        tier: record.tier,
        name: record.name,
        businessName: record.businessName,
        phone: record.phone,
        location: record.location,
      });
      setIsEditModalVisible(true);
    } else {
      setSelectedRecord(null);
      setIsViewModalVisible(false); // optional: keep view closed when adding
      form.resetFields();
      setIsAddModalVisible(true);
    }
  };

  const handleDelete = async (recordId) => {
    console.log("Delete handler invoked for", recordId);
    if (!recordId) {
      message.error("No merchant id found for deletion");
      return;
    }
    const target = response?.data?.find((m) => m._id === recordId);

    Swal.fire({
      title: "Delete merchant?",
      text: `This will remove ${target?.businessName || "this merchant"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deleteMerchant(recordId).unwrap();
        message.success("Merchant deleted successfully");
      } catch (err) {
        console.error("Delete merchant failed", err);
        message.error(err?.data?.message || "Failed to delete merchant");
      }
    });
  };

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      await updateMerchantStatus({
        id: recordId,
        status: newStatus === "Active" ? "active" : "inactive",
      }).unwrap();
      message.success(`Merchant status updated to ${newStatus}`);
    } catch (err) {
      console.error("Status update failed", err);
      message.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleApproveMerchant = async (recordId) => {
    try {
      await updateApprovalStatus({
        id: recordId,
        approveStatus: "approved",
      }).unwrap();
      message.success("Merchant approved successfully!");
    } catch (err) {
      console.error("Approve failed", err);
      message.error(err?.data?.message || "Failed to approve merchant");
    }
  };

  const handleRejectMerchant = async (recordId) => {
    try {
      await updateApprovalStatus({
        id: recordId,
        approveStatus: "rejected",
      }).unwrap();
      message.success("Merchant rejected!");
    } catch (err) {
      console.error("Reject failed", err);
      message.error(err?.data?.message || "Failed to reject merchant");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between md:flex-row flex-col md:items-end items-start gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold">Merchant Management</h1>
          <p className="text-[16px] font-normal">
            Effortlessly manage your merchants and track performance.
          </p>
        </div>

        <div className="flex md:flex-row flex-col items-end gap-4">
          <Input
            placeholder="Search by Customer ID, Name, Phone or Email, Location"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-96 h-10"
          />
          <Button
            className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
            onClick={() => showAddOrEditModal()}
          >
            Add New Merchant
          </Button>
          <Button className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold">
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <MerchantTableColumn
          data={tableData}
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={paginationData}
          onPaginationChange={handlePaginationChange}
          onView={showViewModal}
          onEdit={showAddOrEditModal}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onApprove={handleApproveMerchant}
          onReject={handleRejectMerchant}
        />
      </div>

      {/* View Modal */}
      {isViewModalVisible && selectedRecord && (
        <ViewModal
          visible={isViewModalVisible}
          record={selectedRecord}
          onCancel={() => {
            setIsViewModalVisible(false);
            setSelectedRecord(null);
          }}
        />
      )}

      {/* Add or Edit Merchant Modal */}
      <AddEditModal
        visible={isAddModalVisible || isEditModalVisible}
        selectedRecord={isEditModalVisible ? selectedRecord : null}
        form={form}
        handleAddMerchant={handleAddMerchant}
        handleUpdateMerchant={handleUpdateMerchant}
        setIsAddModalVisible={setIsAddModalVisible}
        setIsEditModalVisible={setIsEditModalVisible}
      />
    </div>
  );
};

export default MerchantManagement;
