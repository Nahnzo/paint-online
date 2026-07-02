import { useState } from 'react'
import { brushActions } from 'entities/Brush'
import { useActionCreators } from 'shared/hooks/hooks'
import { ColorPicker } from 'shared/ui/ColorPicker'
import { RangePicker } from 'shared/ui/RangePicker'
import { ToolSettingsField } from '../model/types'

type ToolSettingsProps = {
  fields: ToolSettingsField[]
}

export const ToolSettings = ({ fields }: ToolSettingsProps) => {
  const actions = useActionCreators(brushActions)

  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      fields
        .filter((f): f is Extract<ToolSettingsField, { kind: 'range' }> => f.kind === 'range')
        .map((f) => [f.action, 1]),
    ),
  )

  return (
    <>
      {fields.map((field) => {
        if (field.kind === 'color') {
          return (
            <div key={field.label}>
              <p>{field.label}</p>
              <ColorPicker action={actions.setColor} defaultValue={field.defaultValue} />
            </div>
          )
        }

        return (
          <div key={field.action}>
            <p>{field.label}</p>
            <RangePicker
              min={field.min}
              max={field.max}
              value={values[field.action]}
              handler={(e) => {
                const value = Number(e)
                setValues((prev) => ({ ...prev, [field.action]: value }))
                actions[field.action](value)
              }}
            />
          </div>
        )
      })}
    </>
  )
}
