"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanOption } from "@/types/plan";

interface ChoosePlanProps {
  onPlanSelect?: (plan: PlanOption) => void;
}

interface PlanFieldProps {
  label: string;
  value: string;
  hasDropdown?: boolean;
}

const PlanField = ({ label, value, hasDropdown = false }: PlanFieldProps) => (
  <div className="space-y-2">
    <label className="block text-[#7FCCCC] font-medium">{label}</label>
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-2 border border-[#7FCCCC]/30 rounded-lg bg-white">
        <span className="font-mono text-[#374151]">{value}</span>
        {hasDropdown && <ChevronDown className="w-4 h-4 text-[#7FCCCC]" />}
      </div>
      <div className="absolute bottom-1.5 left-4 right-4 h-px bg-[#7FCCCC]/30" />
    </div>
  </div>
);

const PlanCard = ({
  type,
  onSelect,
}: {
  type: "call" | "chat";
  onSelect: () => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <div className="grid grid-cols-5 gap-8 items-start mb-4">
      <PlanField
        label={`${type} Duration`}
        value={`10 min ${type}`}
        hasDropdown
      />
      <PlanField label="Time" value="1:00 PM" hasDropdown />
      <PlanField label="Date" value="17 Oct 2024" hasDropdown />
      <PlanField label="Validity" value="23h : 52min" />
      <PlanField label="Price" value="$ 200" />
    </div>
    <div className="flex justify-end">
      <Button onClick={onSelect} className="bg-[#7FCCCC] hover:bg-[#6BBBBB]">
        Choose The Plan
      </Button>
    </div>
  </div>
);

const MobilePlanFields = ({ onSelect }: { onSelect: () => void }) => (
  <div className="space-y-6">
    <PlanField label="Call Duration" value="10 min Call" hasDropdown />
    <PlanField label="Time" value="1:00 PM" hasDropdown />
    <PlanField label="Date" value="17 Oct 2024" hasDropdown />
    <PlanField label="Validity" value="23h : 52min" />
    <PlanField label="Price" value="$ 200" />
    <Button
      onClick={onSelect}
      className="w-full py-3 bg-[#7FCCCC] hover:bg-[#6BBBBB]"
    >
      Choose The Plan
    </Button>
  </div>
);

export default function ChoosePlan({
  onPlanSelect = () => {},
}: ChoosePlanProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);
  console.log(selectedPlan);

  const handlePlanSelect = (plan: PlanOption) => {
    setSelectedPlan(plan);
    onPlanSelect(plan);
  };

  return (
    <div className="w-full mt-10">
      <h1 className="text-center text-2xl md:text-3xl font-bold text-[#B4A5E8] mb-8">
        Choose Plan
      </h1>

      {/* Desktop Layout */}
      <div className="hidden md:block space-y-6">
        <PlanCard
          type="call"
          onSelect={() =>
            handlePlanSelect({
              type: "call",
              duration: "10 min",
              time: "1:00 PM",
              date: "17 Oct 2024",
              validity: "23h : 52min",
              price: 200,
            })
          }
        />
        <PlanCard
          type="chat"
          onSelect={() =>
            handlePlanSelect({
              type: "chat",
              duration: "10 min",
              time: "1:00 PM",
              date: "17 Oct 2024",
              validity: "23h : 52min",
              price: 200,
            })
          }
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden bg-white rounded-2xl shadow-sm p-6">
        <MobilePlanFields
          onSelect={() =>
            handlePlanSelect({
              type: "call",
              duration: "10 min",
              time: "1:00 PM",
              date: "17 Oct 2024",
              validity: "23h : 52min",
              price: 200,
            })
          }
        />
      </div>
    </div>
  );
}
