import { FC } from "react";
import { displayBalance } from "../utils";
import { useAccountStore } from "../store";
import { useForm } from "react-hook-form";
// import { AdenaService } from "../services/adena/adena";
// import { EMessageType } from "../services/adena/adena.types";
// import { constants } from "../constants";

const SendForm: FC = () => {
  const { account } = useAccountStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ submission: string }>();
  if (!account) return null;
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    // await AdenaService.sendTransaction(
    //   [
    //     {
    //       type: EMessageType.MSG_CALL,
    //       value: {
    //         caller: account.address,
    //         send: "",
    //         pkg_path: constants.realmPath,
    //         func: "XXXXX",
    //         args: null,
    //       },
    //     },
    //   ],
    //   5000000
    // );
  });

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl italic">send gnot</h2>
        <p>you have {displayBalance(+account!.coins.split("ugnot")[0])}</p>
      </div>
      <div className="space-y-4 w-full">
        <h2 className="text-2xl italic">recipients and amounts</h2>
        <p>
          enter one address and amount in GNOT on each line. supports any
          format.
        </p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-0">
            {errors.submission && (
              <p className="text-red-500">this field is required</p>
            )}
            <textarea
              className={`w-full h-32 p-2 border text-primary bg-secondary outline-none ${
                errors.submission
                  ? "border-red-500 placeholder:text-red-500"
                  : "border-primary"
              }`}
              placeholder="0x1234=100"
              {...register("submission", { required: true })}
            />
          </div>
          <button
            className="w-full text-black italic px-3 py-1 border-none bg-primary shadow-button"
            type="submit"
          >
            send
          </button>
        </form>
      </div>
    </>
  );
};

export default SendForm;
