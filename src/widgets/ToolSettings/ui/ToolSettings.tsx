import { useState } from 'react'
import { brushActions } from 'entities/Brush'
import { useActionCreators } from 'shared/hooks/hooks'
import { ColorPicker } from 'shared/ui/ColorPicker'
import { RangePicker } from 'shared/ui/RangePicker'
import { ToolSettingsField } from '../model/types'
import { defaultBackgroundColors, defaultColors } from 'shared/consts/consts'
import { sceneActions } from 'entities/Scene'
import { AnyToolSettingsKey } from 'entities/Tool'

type ToolSettingsProps = {
  fields: ToolSettingsField[]
}

export const ToolSettings = ({ fields }: ToolSettingsProps) => {
  const toolActions = useActionCreators(brushActions)
  const sceneAction = useActionCreators(sceneActions)

  const updateField = (key: AnyToolSettingsKey, value: string | number) => {
    toolActions.updateSettings({ [key]: value })
    sceneAction.updateSelectedNodeSettings({ [key]: value })
  }

  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      fields
        .filter((f): f is Extract<ToolSettingsField, { kind: 'range' }> => f.kind === 'range')
        .map((f) => [f.settingsKey, 1]),
    ),
  )

  return (
    <>
      {fields.map((field) => {
        if (field.kind === 'color') {
          return (
            <div key={field.label}>
              <p>{field.label}</p>
              <ColorPicker
                action={(value) => updateField('color', value)}
                defaultValue={field.defaultValue}
                colors={defaultColors}
              />
              {field.backgroundColor && (
                <>
                  <p>Background color</p>
                  <ColorPicker
                    defaultValue="transparent"
                    colors={defaultBackgroundColors}
                    action={(value) => updateField('backgroundColor', value)}
                  />
                </>
              )}
            </div>
          )
        }
        return (
          <div key={field.settingsKey}>
            <p>{field.label}</p>
            <RangePicker
              min={field.min}
              max={field.max}
              value={values[field.settingsKey]}
              handler={(e) => {
                const value = Number(e)
                setValues((prev) => ({ ...prev, [field.settingsKey]: value }))
                updateField(field.settingsKey, value)
              }}
            />
          </div>
        )
      })}
    </>
  )
}
