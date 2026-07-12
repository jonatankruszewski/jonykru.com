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
    <div className="mb-1">
      <label
        htmlFor={name}
        className="block font-mono text-label uppercase tracking-label text-ink-muted mb-2"
      >
        {label}
        {required && <span className="text-error ms-1">*</span>}
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
        className={`block w-full resize-none border bg-canvas px-4 py-3 text-ink placeholder:text-ink-muted transition-colors min-h-[140px] ${
          hasError ? 'border-error' : 'border-rule focus:border-ink'
        } ${className}`}
        placeholder={props.placeholder}
        {...textAreaProps}
        value={typeof field.value === 'string' ? field.value : ''}
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

export default TextAreaInput
