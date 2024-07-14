import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useTokenStore } from "../store";
import { DisperseForm } from "./SendForm";

const RecipientsAndAmounts: FC = () => {
  const { token } = useTokenStore();
  const {
    register,
    formState: { errors },
  } = useFormContext<DisperseForm>();

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-2xl italic">recipients and amounts</h2>
      <p>
        enter one address and amount in {token?.symbol ?? "GNOT"} on each line.
        supports any format.
      </p>
      <div className="space-y-0">
        {errors.submission?.type === "required" && (
          <p className="text-red-500">this field is required</p>
        )}
        {errors.submission?.type === "manual" && (
          <p className="text-red-500">{errors.submission.message}</p>
        )}
        <textarea
          className={`w-full h-32 p-2 border text-primary bg-secondary outline-none ${
            errors.submission
              ? "border-red-500 placeholder:text-red-500"
              : "border-primary"
          }`}
          placeholder="g1dmt3sa5ucvecxuhf3j6ne5r0e3z4x7h6c03xc0=100"
          {...register("submission", { required: true })}
        />
      </div>
    </div>
  );
};

export default RecipientsAndAmounts;
