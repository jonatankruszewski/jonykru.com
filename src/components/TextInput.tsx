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
    <>
      <label
        htmlFor={name}
        className="text-white block text-sm mb-2 font-medium"
      >
        {label} {required ? '*' : ''}
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
        className={`bg-[#18191E] border placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5 transition-all focus:outline-none ${
          hasError
            ? 'border-red-500 focus:ring-2 focus:ring-red-500'
            : 'border-[#33353F] focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
        } ${className}`}
        placeholder="jacob@google.com"
        {...rest}
        required={false}
      />
      {
        <div className="p-2 flex gap-2 text-red-600 items-center min-h-[32px]">
          {hasError && fieldState.error && (
            <>
              <Info size={16} />
              <p className="text-xs">{fieldState.error.message}</p>
            </>
          )}
        </div>
      }
    </>
  )
}

export default TextInput
