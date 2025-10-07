import React from 'react'

export default function Editor({ value, onChange }) {
  return (
    <textarea
      className="editor"
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      placeholder="Start typing… share the doc ID to collaborate in real-time."
    />
  )
}
