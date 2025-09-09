import React from 'react'
import { styles } from './Pill.styles'

interface PillProps {
  score: number
  maxScore?: number
}

export const Pill: React.FC<PillProps> = ({ score, maxScore = 100 }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981' // green-500
    if (score >= 60) return '#F59E0B' // amber-500
    if (score >= 40) return '#F97316' // orange-500
    return '#EF4444' // red-500
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return '#D1FAE5' // green-100
    if (score >= 60) return '#FEF3C7' // amber-100
    if (score >= 40) return '#FED7AA' // orange-100
    return '#FEE2E2' // red-100
  }

  return (
    <div
      style={{
        ...styles.pill,
        backgroundColor: getScoreBackground(score),
        color: getScoreColor(score),
        border: `1px solid ${getScoreColor(score)}20`
      }}
    >
      {score}/{maxScore}
    </div>
  )
}

