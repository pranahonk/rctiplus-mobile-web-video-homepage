import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"

export default function StoriesV3({ ...props }) {
  const state = useSelector(state => state)
  console.log(state)
  return (
    <>
      test
    </>
  )
}