import { showToast } from "./toasts/ToastComponent";
import React, { useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { increaseCreditLimit } from "../services/CreditCardsService";
import { CreditLimitFormProps, FormValues } from "../types";

const CreditLimitForm: React.FC<CreditLimitFormProps> = ({
  open,
  onClose,
  card,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const formRef = useRef<HTMLDivElement>(null);

  const onSubmitForm: SubmitHandler<FormValues> = async (data) => {
    try {
      await increaseCreditLimit({ ...data, cardId: card.id });
      showToast("Credit limit increased successfully!", "success");
      onClose();
      reset();
    } catch (error: unknown) {
      showToast("Error increasing credit limit!", "error"); 
      console.error("Error submitting form:", error.message);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  const onCloseHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTimeout(() => onClose(), 100);
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={formRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          Request Credit Limit Increase
        </h2>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="mb-4">
            <label className="block mb-2">Requested Credit Limit</label>
            <input
              type="number"
              {...register("requestedFrameAmount", {
                required: "This field is required",
                min: {
                  value: 0,
                  message: "Value must be greater than or equal to 0",
                },
                max: {
                  value: 100000,
                  message: "Value must be less than or equal to 100000",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.requestedFrameAmount && (
              <span className="text-red-500 text-sm">
                {errors.requestedFrameAmount.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Occupation</label>
            <select
              {...register("occupation", {
                required: "This field is required",
              })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self-Employed</option>
              <option value="other">Other</option>
            </select>
            {errors.occupation && (
              <span className="text-red-500 text-sm">
                {errors.occupation.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2">Average Monthly Income</label>
            <input
              type="number"
              {...register("averageMonthlyIncome", {
                required: "This field is required",
                min: {
                  value: 0,
                  message: "Value must be greater than or equal to 0",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.averageMonthlyIncome && (
              <span className="text-red-500 text-sm">
                {errors.averageMonthlyIncome.message}
              </span>
            )}
          </div>
          {!card.isCardBlocked && (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Increase Credit Limit
            </button>
          )}
        </form>
        <button
          onClick={(e)=>onCloseHandler(e)}
          className="mt-4 w-full bg-gray-500 text-white p-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CreditLimitForm;
