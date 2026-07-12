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
        className="block font-mono text-label uppercase tracking-label text-ink-muted mb-2"
      >
        {label}
        {required && <span className="text-error ms-1">*</span>}
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
        className={`block w-full border bg-canvas px-4 py-3 text-ink placeholder:text-ink-muted transition-colors ${
          hasError ? 'border-error' : 'border-rule focus:border-ink'
        } ${className}`}
        {...rest}
        required={false}
      />
      <div className="min-h-[24px] mt-1">
        {hasError && fieldState.error && (
          <div className="flex gap-1.5 text-error items-center" role="alert">
            <Info size={14} aria-hidden />
            <p className="font-mono text-label">{fieldState.error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TextInput
