import { useState, useEffect, useMemo } from "react";
import { Card, Button, List, message } from "antd";
import {
  EditOutlined,
  PlusOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import EditModal from "./components/EditModal";
import {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useTogglePackageStatusMutation,
} from "../../redux/apiSlices/packageSlice";
import SubscriptionHeadingIcon from "../../assets/subscription-heading.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PackagesPlans = () => {
  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetPackagesQuery([]);

  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const [toggleStatus, { isLoading: isToggling }] =
    useTogglePackageStatusMutation();

  // Transform API data to UI format
  const packages = useMemo(() => {
    const items = response?.data || [];
    return items.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      price: item.price,
      duration: item.duration,
      features: item.features,
      popular: item.isFreeTrial || false,
      active: item.status === "Active",
      paymentType: item.paymentType,
      loginLimit: item.loginLimit,
    }));
  }, [response]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);

  const togglePackageStatus = async (id) => {
    try {
      await toggleStatus(id).unwrap();
      message.success("Package status updated successfully!");
    } catch (error) {
      console.error("Failed to toggle status:", error);
      message.error(error?.data?.message || "Failed to toggle package status");
    }
  };

  const showModal = (pkg = null) => {
    setIsEditing(!!pkg);
    setCurrentPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentPackage(null);
  };

  const handleDelete = async (id) => {
    // TODO: Implement API mutation for deleting package
    message.warning("Delete requires API implementation");
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this package!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#023F86",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPackages(packages.filter((pkg) => pkg.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The package has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleSubmit = async (values) => {
    try {
      const packageData = {
        title: values.title,
        description: values.description,
        price: Number(values.price),
        duration: values.duration,
        credit: values.credit ? Number(values.credit) : 0,
        paymentType: values.paymentType || "Monthly",
        loginLimit: values.loginLimit ? Number(values.loginLimit) : 1,
        features: values.features.filter((f) => f && f.trim() !== ""),
      };

      if (isEditing) {
        // Update existing package
        await updatePackage({ id: currentPackage.id, ...packageData }).unwrap();
        message.success("Package updated successfully!");
      } else {
        // Create new package
        await createPackage(packageData).unwrap();
        message.success("Package created successfully!");
      }

      setIsModalOpen(false);
      setCurrentPackage(null);
    } catch (error) {
      console.error("Failed to save package:", error);
      message.error(
        error?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} package`
      );
    }
  };

  const getCardStyle = (pkg) => {
    if (pkg.popular) {
      return "shadow-sm rounded-xl  bg-gradient-to-b from-blue-50 to-white hover:shadow-md transition-all transform hover:-translate-y-1";
    }
    return "shadow-sm rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all transform hover:-translate-y-1";
  };

  // react-slick settings
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    dots: true,
    customPaging: (i) => (
      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
    ),
    appendDots: (dots) => (
      <div style={{ bottom: "-30px" }}>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Loading and error states
  if (isLoading || isFetching) {
    return (
      <div className="pt-1 px-4">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading packages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-1 px-4">
        <div className="flex justify-center items-center py-20">
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold mb-2">Error loading packages</p>
            <p className="text-sm">
              {error?.data?.message || "Something went wrong"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-1 px-4">
      <div className="flex flex-col justify-center items-center mb-8">
        {/* <p className="bg-primary px-[12px] py-[2px] text-white rounded-3xl mb-2">
          Pricing Plan
        </p> */}
        <h2 className="text-[28px] font-semibold text-secondary">
          Plans for all sizes
        </h2>
        <p className="text-[15px] font-normal mb-[10px]">
          Simple, transparent pricing that grows with you. Try any plan free for
          30 days.
        </p>
        <Button
          icon={<PlusOutlined />}
          className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
          onClick={() => showModal()}
        >
          Add Package
        </Button>
      </div>
      <div className="flex justify-center">
        <div className="w-4/5 mb-6">
          {packages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No packages available.</p>
              <p>
                Click the "Add Package" button to create your first package.
              </p>
            </div>
          ) : (
            <Slider {...settings}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="px-4">
                  <Card
                    title={null}
                    bordered={false}
                    className={`${getCardStyle(
                      pkg
                    )} transition-transform duration-300`}
                  >
                    <div className="flex justify-end mb-2">
                      <div className="flex gap-2">
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => showModal(pkg)}
                          className="text-gray-800 border-gray-800 hover:text-primary hover:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center mb-2">
                      <img
                        src={SubscriptionHeadingIcon}
                        alt="Subscription Icon"
                        className="w-[40px] h-[40px] mb-4"
                      />
                      <h3 className="text-[20px] font-semibold text-primary ">
                        {pkg.title}
                      </h3>
                      <div className="">
                        <span className="text-secondary font-semibold text-[38px]">
                          {pkg.price}
                        </span>{" "}
                        / {pkg.paymentType}
                      </div>
                      <p className="text-[16px] font-normal text-center text-[#667085]">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg ">
                      <List
                        size="small"
                        dataSource={pkg.features}
                        renderItem={(feature) => (
                          <List.Item className="text-gray-700 border-none py-1">
                            <div className="flex items-start">
                              <CheckCircleFilled className="text-green-500 mr-2 mt-1" />
                              <span>{feature}</span>
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>

                    <Button
                      className={`w-full mt-12 border h-10 ${
                        pkg.active
                          ? "bg-primary text-white hover:!bg-primary hover:!text-white"
                          : "bg-red-500 text-white hover:!bg-gray-400 hover:!text-white"
                      }`}
                      onClick={() => togglePackageStatus(pkg.id)}
                    >
                      {pkg.active ? "Turn Off" : "Turn On"}
                    </Button>
                  </Card>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      <EditModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        currentPackage={currentPackage}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default PackagesPlans;
