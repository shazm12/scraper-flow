import React, { ReactNode } from 'react'

function NodeCard({children , nodeId} : { children: ReactNode, nodeId: string }) {
  return (
    <div>
      {children}
    </div>
  )
}

export default NodeCard;
