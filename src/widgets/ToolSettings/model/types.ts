export type ToolSettingsField =
  | { kind: 'color'; label: string; defaultValue: string; backgroundColor?: string }
  | {
      kind: 'range'
      label: string
      min: number
      max: number
      action: 'setSize' | 'setSprayDensity' | 'setHardness'
    }
