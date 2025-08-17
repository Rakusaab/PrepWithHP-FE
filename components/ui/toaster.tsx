'use client'

import React from 'react'

// Basic toaster implementation - will be enhanced after dependencies are installed
export function Toaster() {
  return <div id="toast-container" className="fixed top-4 right-4 z-50" />
}

export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  console.log(`Toast: ${type} - ${message}`)
  // Basic implementation for now
}
