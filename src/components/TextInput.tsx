import { Info } from 'lucide-react'
import React, { InputHTMLAttributes, useRef, useState } from 'react'
import {
  FieldValues,
  Path,
  useController,
  UseControllerProps
} from 'react-hook-form'

type TextInputProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> = {
  label: string
  type?: 'text' | 'email' | 'password'
} & InputHTMLAttributes<HTMLInputElement> &
  UseControllerProps<TFieldValues, TName>

const TextInput = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  props: TextInputProps<TFieldValues, TName>
) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const {
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled,
    label,
    type = 'text',
    onFocus,
    onBlur,
    className,
    ...rest
  } = props
  const { field, fieldState, formState } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
    field.onBlur?.()
  }

  const hasError =
    fieldState.error && (field.value || isFocused || formState.isSubmitted)

  const required = Boolean(rules?.required)

  return (
    <div className="mb-1">
      <label
        htmlFor={name}
        className="text-gray-700 dark:text-gray-300 block text-sm mb-2 font-medium"
      >
        {label}
        {required && <span className="text-violet-500 ml-1">*</span>}
      </label>

      <input
        {...field}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={(el) => {
          field.ref(el)
          inputRef.current = el
        }}
        type={type}
        name={name}
        className={`bg-gray-50 dark:bg-gray-800/50 border placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 text-sm rounded-xl block w-full px-4 py-3 transition-all focus:outline-none ${
          hasError
            ? 'border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-500/30'
            : 'border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
        } ${className}`}
        {...rest}
        required={false}
      />
      <div className="min-h-[24px] mt-1">
        {hasError && fieldState.error && (
          <div className="flex gap-1.5 text-red-500 items-center">
            <Info size={14} />
            <p className="text-xs">{fieldState.error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TextInput
