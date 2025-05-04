"use client";
import { ParamProps } from '@/types/task';
import React from 'react'

function browserInstanceParam({ param }: ParamProps) {
  return (
    <p className="text-xs">
        {param.name}
    </p>
  )
}

export default browserInstanceParam
