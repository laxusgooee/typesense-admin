import * as React from "react";
import {
  Control,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

export type InputProps<T extends FieldValues> = {
    disabled?: boolean;
    className?: string;
    placeholder?: string;
  control: Control<T>;
} & React.ComponentPropsWithoutRef<"input"> &
  UseControllerProps<T>;

export const Input = <T extends FieldValues>({
    className,
    disabled,
    placeholder,
  ...rest
}: InputProps<T>) => {
  const { field, fieldState } = useController(rest);

  return (
    <div
      data-testid="input-element"
      className="relative mt-2"
    >
        <input
          {...field}
          value={field.value || ""}
          type="text"
          className={`block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 
            
            ${
                fieldState.error?.message && "bg-red-100 !ring-red-500  focus:!ring-red-500 placeholder:text-red-500"
            }
					${
            disabled 
              ? "!border-gray-50 !bg-gray-100 !font-normal !text-greyGrey04"
              : ""
          }`}
          placeholder={placeholder}
          disabled={disabled}
        />
      {!!fieldState.error?.message && (
          <p className="mx-0 my-1 text-[10px] font-body  text-red-500">
            {fieldState.error.message}
          </p>
        )}
    </div>
  );
};

export default Input;
