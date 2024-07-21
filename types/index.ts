import type { formatOnlyForTailwindVariable } from '@/lib/colors'

export interface ColorShade {
  shade: string
  color: string
}

export interface ColorItem {
  name: string
  children: ColorShade[]
}

export type FormatOnlyForTailwindVariableType = (typeof formatOnlyForTailwindVariable)[number]['format']
