import { FC, PropsWithChildren } from "react";

interface ButtonProps {
  isDisabled: boolean;
  onClick?: () => void;
  helperText?: string;
  type: "button" | "submit";
}
const Button: FC<PropsWithChildren<ButtonProps>> = ({
  isDisabled,
  onClick,
  helperText,
  children,
}) => (
  <div className="flex flex-row space-x-6 items-center">
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`text-black italic p-2 border-none bg-primary shadow-button ${
        isDisabled && "cursor-not-allowed opacity-90 text-opacity-30"
      }`}
    >
      {children}
    </button>
    {helperText && <i>{helperText}</i>}
  </div>
);

export default Button;
