import { useState, useEffect, useMemo } from "react";
import { Button } from "antd";
import Swal from "sweetalert2";
import { Form } from "antd";
import EditTierModal from "./modal/EditTierModal.jsx";
import {
  useGetTierQuery,
  useAddTierMutation,
  useUpdateTierMutation,
  useDeleteTierMutation,
} from "../../redux/apiSlices/PointTierSlice";

export default function TierSystem() {
  const [form] = Form.useForm();
  const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
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
  } = useGetTierQuery(queryParams);

  const [addTier, { isLoading: isAdding }] = useAddTierMutation();
  const [updateTier, { isLoading: isUpdating }] = useUpdateTierMutation();
  const [deleteTier, { isLoading: isDeleting }] = useDeleteTierMutation();

  // Memoized tier data from API
  const tierData = useMemo(() => {
    const items = response?.data || [];
    return items.map((item, index) => ({
      key: item._id,
      id: index + 1 + (page - 1) * limit,
      _id: item._id,
      name: item.name,
      threshold: item.pointsThreshold,
      reward: item.reward,
      lockoutDuration: item.accumulationRule,
      pointsSystemLockoutDuration: item.redemptionRule,
      minSpend: item.minTotalSpend,
      isActive: item.isActive,
      admin: item.admin || "-",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      raw: item,
    }));
  }, [response, page, limit]);

  const [tiers, setTiers] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);

  // Update tiers when memoized data changes
  useEffect(() => {
    setTiers(tierData);
  }, [tierData]);

  // Open Set Rules/Edit Modal
  const showRulesModal = (tier) => {
    if (tier) {
      setEditingTier(tier);
      setIsAddMode(false);
      form.setFieldsValue(tier); // fill with existing tier
    } else {
      setEditingTier(null);
      setIsAddMode(true);
      form.resetFields(); // blank form
    }
    setIsRulesModalVisible(true);
  };

  // Close Modal
  const handleCancelRules = () => {
    setIsRulesModalVisible(false);
    setEditingTier(null);
    setIsAddMode(false);
    form.resetFields();
  };

  // Save Tier (Add/Edit)
  const handleSaveRules = async (values) => {
    try {
      const payload = {
        name: values.name,
        pointsThreshold: Number(values.threshold) || 0,
        reward: String(values.reward || ""),
        accumulationRule: Number(values.lockoutDuration) || 0,
        redemptionRule: Math.max(
          1,
          Number(values.pointsSystemLockoutDuration) || 1
        ),
        minTotalSpend: Number(values.minSpend) || 0,
        isActive: true,
      };

      if (isAddMode) {
        const response = await addTier(payload).unwrap();
        Swal.fire(
          "Added!",
          `The "${values.name}" tier has been created.`,
          "success"
        );
      } else {
        const response = await updateTier({
          id: editingTier._id,
          body: payload,
        }).unwrap();
        Swal.fire(
          "Updated!",
          `The "${values.name}" tier has been updated.`,
          "success"
        );
      }
      handleCancelRules();
    } catch (error) {
      Swal.fire(
        "Error!",
        error?.data?.message || "Failed to save tier",
        "error"
      );
    }
  };

  // Remove Tier
  const handleRemove = (tierId) => {
    const tierToRemove = tiers.find((t) => t._id === tierId);
    Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to remove the "${tierToRemove?.name}" tier?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTier(tierId).unwrap();
          Swal.fire(
            "Removed!",
            `The "${tierToRemove?.name}" tier has been removed.`,
            "success"
          );
        } catch (error) {
          Swal.fire(
            "Error!",
            error?.data?.message || "Failed to delete tier",
            "error"
          );
        }
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between flex-col md:flex-row md:items-end items-start gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold">Point & Tier System</h1>
          <p className="text-[16px] font-normal mt-2">
            Configure your tiers, rewards, and point accumulation rules.
          </p>
        </div>
        <Button
          className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
          onClick={() => showRulesModal(null)}
        >
          Add New Tier
        </Button>
      </div>

      {/* Tier Cards */}
      <div className="px-8 py-8 flex flex-col gap-4 border border-gray-200 rounded-lg">
        {isLoading || isFetching ? (
          <p className="text-center text-gray-500">Loading tiers...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load tiers</p>
        ) : tiers.length === 0 ? (
          <p className="text-center text-gray-500">No tiers available</p>
        ) : (
          tiers.map((tier) => (
            <div
              key={tier._id}
              className="px-6 py-4 rounded-lg border border-primary bg-white"
            >
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold text-[24px] text-secondary">
                    {tier.name}
                  </h2>
                  <p>
                    <span className="font-semibold">Points Threshold:</span>{" "}
                    {tier.threshold}
                  </p>
                  <p>
                    <span className="font-semibold">Reward:</span> {tier.reward}
                  </p>
                  <p>
                    <span className="font-semibold">Accumulation Rule:</span>{" "}
                    {tier.lockoutDuration}
                  </p>
                  <p>
                    <span className="font-semibold">Redemption Rule:</span>{" "}
                    {tier.pointsSystemLockoutDuration}
                  </p>
                  <p>
                    <span className="font-semibold">Minimum Spend:</span> $
                    {tier.minSpend}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-primary px-6 py-3 rounded-full text-white hover:text-secondary text-[14px] font-bold"
                    onClick={() => showRulesModal(tier)}
                  >
                    Set Rules
                  </Button>
                  <Button
                    className="bg-red-500 border-red-500 px-6 py-3 rounded-full text-white hover:text-secondary text-[14px] font-bold"
                    onClick={() => handleRemove(tier._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Change Log */}
      <div className="px-8 py-8">
        <div className="px-6 py-4 rounded-lg border border-primary bg-white flex flex-col gap-2 mt-2">
          <h2 className="font-bold text-[24px] text-secondary">
            Tier System Change Log
          </h2>
          <p>Added Gold Tier with 10000 points threshold.</p>
          <p>admin@merchant.com - 2024-06-15 10:30 AM</p>
          <p>Updated Silver Tier point multiplier to 1.5x.</p>
          <p>admin@merchant.com - 2024-06-10 02:00 PM</p>
        </div>
      </div>

      {/* Set Rules / Add Tier Modal */}
      <EditTierModal
        visible={isRulesModalVisible}
        isAddMode={isAddMode}
        editingTier={editingTier}
        form={form}
        isAdding={isAdding}
        isUpdating={isUpdating}
        onCancel={handleCancelRules}
        onSave={handleSaveRules}
      />
    </div>
  );
}
