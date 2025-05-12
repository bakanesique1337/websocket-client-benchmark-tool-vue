import {clientTypeNameMap} from "@/types";

export type InputType = 'number' | 'text' | 'url'

export interface InputProps {
  modelValue: number | string,
  type: InputType,
  name: string,
  min?: number,
  placeholder?: string
}

export interface SelectProps {
  modelValue: string,
  options: typeof clientTypeNameMap,
  name: string
}

export interface ButtonProps {
  disabled?: boolean
}

export interface ConnectionControlProps {
  url: string,
  client: string,
  interval: number,
  running: boolean
}
