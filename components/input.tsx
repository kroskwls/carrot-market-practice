import { InputHTMLAttributes } from "react";

interface InputProps {
  errors?: string[];
  name: string;
}

export default function Input({ errors = [], name, disabled, readOnly, ...rest }: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className={`bg-transparent rounded-md w-full h-10 border-none focus:outline-none ring-1 focus:ring-4 ring-neutral-200 focus:ring-orange-500 placeholder:text-neutral-400 transition text-white ${disabled ? "!text-gray-600" : ""} ${readOnly ? "!text-gray-600 focus:ring-1 focus:ring-neutral-200" : ""}`}
        name={name}
        disabled={disabled}
        readOnly={readOnly}
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">{error}</span>
      ))}
    </div>
  );
}