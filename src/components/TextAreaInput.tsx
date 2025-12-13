import { Info } from 'lucide-react'
import React, { TextareaHTMLAttributes, useRef, useState } from 'react'
import {
  FieldValues,
  Path,
  useController,
  UseControllerProps
} from 'react-hook-form'

type TextAreaInputProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> = {
  label: string
} & TextareaHTMLAttributes<HTMLTextAreaElement> &
  UseControllerProps<TFieldValues, TName>

const TextAreaInput = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  props: TextAreaInputProps<TFieldValues, TName>
) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  const {
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled,
    label,
    onFocus,
    onBlur,
    className,
    ...textAreaProps
  } = props

  const { field, fieldState, formState } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    disabled
  })

  const handleChange = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    onFocus?.(e)
    field.onChange?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
        className="text-gray-900 dark:text-white block text-sm mb-2 font-medium"
      >
        {label} {required ? '*' : ''}
      </label>

      <textarea
        {...field}
        onChange={handleChange}
        onBlur={handleBlur}
        ref={(el) => {
          field.ref(el)
          inputRef.current = el
        }}
        name={name}
        className={`bg-gray-50 dark:bg-[#18191E] border placeholder-gray-400 dark:placeholder-[#9CA2A9] text-gray-900 dark:text-gray-100 text-sm rounded-lg block w-full p-2.5 transition-all focus:outline-none ${
          hasError
            ? 'border-red-500 focus:ring-2 focus:ring-red-500'
            : 'border-gray-300 dark:border-[#33353F] focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
        } ${className}`}
        placeholder="Your message here"
        {...textAreaProps}
        value={typeof field.value === 'string' ? field.value : ''}
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

export default TextAreaInput
