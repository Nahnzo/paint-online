export type ToolSettingsField =
  | {
      kind: 'color'
      label: string
      defaultValue: string
      backgroundColor?: string
      borderWidth?: number
    }
  | {
      kind: 'range'
      label: string
      min: number
      max: number
      settingsKey: 'size' | 'density' | 'hardness' | 'borderWidth' | 'backgroundColor'
    }
