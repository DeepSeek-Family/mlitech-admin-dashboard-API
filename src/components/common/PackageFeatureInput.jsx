import React, { useState, useEffect, forwardRef } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";

const FeaturedInput = forwardRef(({ value = [], onChange }, ref) => {
  const [features, setFeatures] = useState(
    Array.isArray(value) && value.length > 0 ? value : ["", ""]
  );

  useEffect(() => {
    if (Array.isArray(value)) {
      setFeatures(value);
    }
  }, [value]);

  const handleAddFeature = () => {
    const newFeatures = [...features, ""];
    setFeatures(newFeatures);
    if (onChange) onChange(newFeatures);
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    if (onChange) onChange(newFeatures);
  };

  const handleFeatureChange = (index, newValue) => {
    const newFeatures = [...features];
    newFeatures[index] = newValue;
    setFeatures(newFeatures);
    if (onChange) onChange(newFeatures);
  };

  return (
    <div ref={ref}>
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-2 w-full mb-4">
          <Input
            placeholder="Feature name"
            className="w-full mli-tall-input"
            value={feature || ""}
            onChange={(e) => handleFeatureChange(index, e.target.value)}
          />

          {features.length > 2 && (
            <MinusCircleOutlined
              className="text-red-500 text-lg cursor-pointer mt-3"
              onClick={() => handleRemoveFeature(index)}
            />
          )}
        </div>
      ))}

      <div className="w-full flex justify-center">
        <Button
          type="dashed"
          onClick={handleAddFeature}
          icon={<PlusOutlined />}
          className="w-full"
        >
          Add Feature
        </Button>
      </div>
    </div>
  );
});

FeaturedInput.displayName = "FeaturedInput";

export default FeaturedInput;
