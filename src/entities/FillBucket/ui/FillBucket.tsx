import { brushActions } from 'entities/Brush'
import { PaintBucketIcon } from 'lucide-react'
import { useActionCreators } from 'shared/hooks/hooks'

const FillBucket = () => {
  const brushAction = useActionCreators(brushActions)

  const handleFillBucket = () => {
    brushAction.setToolType('fill-bucket')
  }

  return <PaintBucketIcon onClick={handleFillBucket} />
}

export default FillBucket
