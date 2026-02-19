export interface RangePickerProps {
  max?: number
  min?: number
  value?: number
  handler: (value: number) => void
}
