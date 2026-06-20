import { brushActions } from 'entities/Brush'
import { PaintBucketIcon } from 'lucide-react'
import { useActionCreators } from 'shared/hooks/hooks'

const FillBucket = () => {
  const brushAction = useActionCreators(brushActions)

  const handleFillBucket = () => {
    brushAction.setToolType('fillBucket')
  }

  return <PaintBucketIcon onClick={handleFillBucket} cursor="pointer" />
}

export default FillBucket
