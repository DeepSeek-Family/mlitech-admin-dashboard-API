import { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import MarchantIcon from "../../../assets/marchant.png";
import CustomTable from "../../common/CustomTable";
import { useLazyGetMerchantDetailsQuery } from "../../../redux/apiSlices/merchantSlice";
import { getImageUrl } from "../../common/imageUrl";

const detailsColumns = [
  // {
  //   title: "SL",
  //   dataIndex: "sl",
  //   key: "sl",
  // },
  {
    title: "Customer Name",
    dataIndex: "name",
    key: "name",
  },
  // {
  //   title: "Email",
  //   dataIndex: "email",
  //   key: "email",
  // },
  {
    title: "Customer ID",
    dataIndex: "customUserId",
    key: "customUserId",
  },
  {
    title: "Total Transactions",
    dataIndex: "totalTransactions",
    key: "totalTransactions",
  },
  {
    title: "Total Sell Amount",
    dataIndex: "totalSellAmount",
    key: "totalSellAmount",
  },
  {
    title: "Total Earned Points",
    dataIndex: "totalEarnedPoints",
    key: "totalEarnedPoints",
    render: (value) => Number(value || 0).toFixed(2),
  },
  {
    title: "Total Redeemed Points",
    dataIndex: "totalRedeemedPoints",
    key: "totalRedeemedPoints",
  },
];

const ViewModal = ({ visible, record, onCancel }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [merchantDetails, setMerchantDetails] = useState(
    record?.raw || record || {},
  );
  const [fetchMerchantDetails, { isFetching }] =
    useLazyGetMerchantDetailsQuery();

  const customersPagination =
    merchantDetails?.customersPagination ||
    record?.raw?.customersPagination ||
    record?.customersPagination ||
    {};

  const customers =
    merchantDetails?.customers ||
    record?.raw?.customers ||
    record?.customers ||
    [];

  useEffect(() => {
    if (!visible || !record?.recordId) return;

    const initialPage = customersPagination?.page || 1;
    const initialLimit = 5;

    setCurrentPage(initialPage);
    setPageSize(initialLimit);

    fetchMerchantDetails({
      id: record.recordId,
      page: initialPage,
      limit: initialLimit,
    })
      .unwrap()
      .then((response) => {
        setMerchantDetails(response?.data || response || {});
      })
      .catch((error) => {
        console.error("Failed to load merchant details:", error);
      });
  }, [visible, record?.recordId]);

  useEffect(() => {
    if (!visible || !record?.recordId) return;

    fetchMerchantDetails({
      id: record.recordId,
      page: currentPage,
      limit: pageSize,
    })
      .unwrap()
      .then((response) => {
        setMerchantDetails(response?.data || response || {});
      })
      .catch((error) => {
        console.error("Failed to load merchant details:", error);
      });
  }, [currentPage, pageSize, visible, record?.recordId, fetchMerchantDetails]);
  const customerTableData = customers.map((item, index) => ({
    ...item,
    sl: (currentPage - 1) * pageSize + index + 1,
    key: item?.userId || item?._id?.userId || `${index}`,
  }));

  const paginationData = useMemo(
    () => ({
      pageSize,
      total: customersPagination?.total ?? customerTableData.length,
      current: currentPage,
    }),
    [
      customersPagination?.total,
      customerTableData.length,
      currentPage,
      pageSize,
    ],
  );

  return (
    <Modal visible={visible} onCancel={onCancel} width={1000} footer={[]}>
      <div className="flex flex-col">
        <div className="flex flex-row items-start justify-between gap-3 mt-8 mb-8">
          <img
            src={getImageUrl(record?.profile)}
            alt={record.name}
            style={{
              width: "168px",
              height: "168px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
              display: "block",
            }}
          />
          <div className="flex flex-col gap-2 w-full border border-primary rounded-md p-4">
            <p className="text-[22px] font-bold text-primary">
              Marchant Profile
            </p>
            <p>
              <strong>Name:</strong> {record.firstName}
            </p>
            <p>
              <strong>Business Name:</strong> {record.businessName}
            </p>
            <p>
              <strong>Email:</strong> {record.email}
            </p>
            <p>
              <strong>Phone:</strong> {record.phone}
            </p>
            <p>
              <strong>Location:</strong> {record.location}
            </p>
            {/* <p>
              <strong>Total Sales:</strong> {record.totalSales}
            </p> */}
            <p>
              <strong>Status:</strong> {record.status}
            </p>
            {/* <p>
              <strong>Total Points Earned:</strong> {record.totalPointsEarned}
            </p>
            <p>
              <strong>Total Points Redeemed:</strong>{" "}
              {record.totalPointsRedeemed}
            </p>
            <p>
              <strong>Total Points Pending:</strong> {record.totalPointsPending}
            </p>
            <p>
              <strong>Total Visits:</strong> {record.totalVisits}
            </p> */}
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={record.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {record.website}
              </a>
            </p>
            <p>
              <strong>Address:</strong> {record.location}
            </p>
            <p>
              <strong>Services Offered:</strong> {record.service}
            </p>
            {/* <p>
              <strong>Tier:</strong> {record.tier || "N/A"}
            </p> */}
            {/* <p>
              <strong>Membership Type:</strong>{" "}
              {record.subscriptionType || "N/A"}
            </p> */}
            {/* <p>
              <strong>Last Payment Date:</strong>{" "}
              {record.lastPaymentDate || "00-00-0000"}
            </p>
            <p>
              <strong>Expiry Date:</strong> {record.expiryDate || "00-00-0000"}
            </p> */}
            <p>
              <strong>Total Revenue:</strong> {record.totalRevenue}
            </p>
          </div>
        </div>
        <CustomTable
          columns={detailsColumns}
          data={customerTableData}
          pagination={paginationData}
          onPaginationChange={(nextPage, nextPageSize) => {
            setCurrentPage(nextPage);
            setPageSize(nextPageSize);
          }}
          isFetching={isFetching}
          rowKey={(row) => row?.userId || row?._id?.userId || row?.key}
        />
      </div>
    </Modal>
  );
};

export default ViewModal;
