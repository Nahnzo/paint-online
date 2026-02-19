// import { useActionCreators } from 'shared/hooks/hooks'
// import { useState } from 'react'
// import { brushActions } from 'entities/Brush'
// import { RangePicker } from 'shared/ui/RangePicker'
// import styles from './brushChangeSize.module.css'

// const ToolChangeSize = () => {
//   const [brushSize, setBrushSize] = useState(1)
//   const actions = useActionCreators(brushActions)

//   const changeBrushSize = (size: number) => {
//     actions.setSize(size)
//     setBrushSize(size)
//   }

//   return (
//     <div className={styles.brushSizeContainer}>
//       <RangePicker value={brushSize} handler={(e) => changeBrushSize(Number(e))} />
//     </div>
//   )
// }

// export default ToolChangeSize
