import { useEffect, useState } from "react";
import { Modal } from "antd";
import Swal from "sweetalert2";
import NewCampaign from "../../promotionManagement/components/NewCampaing.jsx";
import { CopyOutlined } from "@ant-design/icons";
import CustomerReferredTableColumn from "./CustomerReferredTableColumn.jsx";
import {
  useGetSalesRepDataQuery,
  useAcknowledgeSalesRepMutation,
  useGenerateSalesRepTokenMutation,
  useUpdateUserStatusMutation,
} from "../../../redux/apiSlices/salesRepSlice";

const CustomerReferred = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetSalesRepDataQuery({ page, limit: pageSize });

  const [acknowledgeSalesRep, { isLoading: isAcknowledging }] =
    useAcknowledgeSalesRepMutation();
  const [generateSalesRepToken, { isLoading: isGeneratingToken }] =
    useGenerateSalesRepTokenMutation();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();

  // Normalize API data into table rows
  useEffect(() => {
    const items = response?.data || [];
    const mappedRows = items.map((item, index) => {
      const customer = item.customerId || {};
      const hasToken = Boolean(item.token);
      const hasAcknowledged = Boolean(item.acknowledged);
      const statusProgress = hasToken ? 2 : hasAcknowledged ? 1 : 0;

      return {
        recordId: item._id,
        id: index + 1 + (page - 1) * pageSize,
        customerId: customer._id,
        customerName: customer.firstName || "-",
        phoneNumber: customer.phone || "-",
        email: customer.email || "-",
        salesRep: customer.salesRep || "-",
        paymentStatus: item.paymentStatus
          ? `${item.paymentStatus
              .charAt(0)
              .toUpperCase()}${item.paymentStatus.slice(1)}`
          : "-",
        actionStatus: customer.status === "active" ? "Active" : "Inactive",
        status: customer.status || "inactive",
        statusProgress,
        acknowledgeDate: item.acknowledgeDate
          ? new Date(item.acknowledgeDate).toLocaleDateString()
          : null,
        generatedToken: item.token || "",
        activateDate: null,
        tokenGeneratedDate: item.tokenGenerateDate
          ? new Date(item.tokenGenerateDate).toLocaleDateString()
          : null,
        acknowledged: hasAcknowledged,
      };
    });

    setRows(mappedRows);
  }, [response, page, pageSize]);

  const [isNewCampaignModalVisible, setIsNewCampaignModalVisible] =
    useState(false);
  const [isCashTokenModalVisible, setIsCashTokenModalVisible] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [referralID, setReferralID] = useState("ANDREW856 D");

  // Handle Acknowledge Cash Payment - Call API
  const handleAcknowledge = async (record) => {
    try {
      await acknowledgeSalesRep(record.customerId).unwrap();

      // Update local state after successful API call
      setRows((prev) =>
        prev.map((item) =>
          item.customerId === record.customerId
            ? {
                ...item,
                statusProgress: Math.max(item.statusProgress, 1),
                acknowledgeDate: new Date().toLocaleDateString(),
                acknowledged: true,
              }
            : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "Acknowledged!",
        text: "Cash payment acknowledged successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to acknowledge payment.",
      });
    }
  };

  const handleAddCampaign = (newCampaign) => {
    setRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        status: "active",
        statusProgress: 0,
        ...newCampaign,
      },
    ]);
    setIsNewCampaignModalVisible(false);
    Swal.fire({
      icon: "success",
      title: "Campaign Added!",
      text: "Your new campaign has been added successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Generate Cash Token - Call API
  const handleGenerateToken = async (record) => {
    try {
      const response = await generateSalesRepToken(record.customerId).unwrap();
      const token = response?.data?.token || "TOKEN_GENERATED";

      setSelectedRecord(record);
      setGeneratedToken(token);

      setRows((prevData) =>
        prevData.map((item) =>
          item.customerId === record.customerId
            ? {
                ...item,
                generatedToken: token,
                tokenGeneratedDate: new Date().toLocaleDateString(),
                statusProgress: 2,
              }
            : item
        )
      );
      setIsCashTokenModalVisible(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to generate token.",
      });
    }
  };

  // Then, update handleConfirmToken:
  const handleConfirmToken = () => {
    setReferralID(generatedToken); // set token as referral ID
    Swal.fire({
      icon: "success",
      title: "Token Generated!",
      text: `Your cash token: ${generatedToken}`,
    });
    setIsCashTokenModalVisible(false);
  };

  // Toggle user active/inactive
  const handleToggleUserStatus = async (record) => {
    const isCurrentlyActive = record.status === "active";
    const newStatus = isCurrentlyActive ? "inActive" : "active";

    Swal.fire({
      title: isCurrentlyActive
        ? "Deactivate this user?"
        : "Activate this user?",
      text: `This will set the user status to ${
        isCurrentlyActive ? "inactive" : "active"
      }.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isCurrentlyActive
        ? "Yes, deactivate"
        : "Yes, activate",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call API to update user status
          await updateUserStatus({
            id: record.customerId,
            status: newStatus,
          }).unwrap();

          // Update local state after successful API call
          setRows((prevData) =>
            prevData.map((item) =>
              item.recordId === record.recordId
                ? {
                    ...item,
                    status: newStatus === "active" ? "active" : "inactive",
                    actionStatus: newStatus === "active" ? "Active" : "Inactive",
                    statusProgress: newStatus === "active" ? Math.max(item.statusProgress, 1) : item.statusProgress,
                    activateDate: new Date().toLocaleDateString(),
                  }
                : item
            )
          );

          Swal.fire({
            title: isCurrentlyActive ? "Deactivated!" : "Activated!",
            text: `User has been set to ${
              isCurrentlyActive ? "inactive" : "active"
            }.`,
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error?.data?.message || "Failed to update user status.",
          });
        }
      }
    });
  };

  const handleCopyReferralID = () => {
    if (!referralID) return;
    navigator.clipboard
      .writeText(referralID)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Copied!",
          text: `Referral ID "${referralID}" has been copied.`,
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to copy referral ID.",
        });
      });
  };

  return (
    <div>
      <div className="flex justify-between flex-col md:flex-row gap-4 items-start md:items-end mb-4">
        <div>
          <h1 className="text-[24px] font-bold">Customers Referred</h1>
          <p className="text-[16px] font-normal mt-0">
            Track and manage customers you've referred effortlessly.
          </p>
        </div>
        <div className="flex flex-col items-center gap-1 border border-secondary rounded-md px-12 py-2">
          <p>Your Referral ID</p>
          <div className="flex items-center gap-2">
            <p className="font-bold text-[16px]">{referralID}</p>
            <button onClick={handleCopyReferralID}>
              <CopyOutlined />
            </button>
          </div>
        </div>
      </div>

      <CustomerReferredTableColumn
        data={rows}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={{
          current: response?.pagination?.page || page,
          pageSize: response?.pagination?.limit || pageSize,
          total: response?.pagination?.total || rows.length,
        }}
        onPaginationChange={(nextPage, nextPageSize) => {
          setPage(nextPage);
          setPageSize(nextPageSize);
        }}
        onAcknowledge={handleAcknowledge}
        onToggleStatus={handleToggleUserStatus}
        onGenerateToken={handleGenerateToken}
      />

      {/* New Campaign Modal */}
      <Modal
        open={isNewCampaignModalVisible}
        onCancel={() => setIsNewCampaignModalVisible(false)}
        footer={null}
        width={1000}
      >
        <NewCampaign
          onSave={handleAddCampaign}
          onCancel={() => setIsNewCampaignModalVisible(false)}
        />
      </Modal>

      {/* Cash Token Modal */}
      <Modal
        open={isCashTokenModalVisible}
        onOk={handleConfirmToken}
        onCancel={() => setIsCashTokenModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <div className="flex flex-col items-center my-16 border border-secondary rounded-md p-8">
          <p className="text-[16px] font-normal">
            Cash token generated for John Doe
          </p>
          <p className="text-[16px] font-bold mt-2">{generatedToken}</p>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerReferred;
