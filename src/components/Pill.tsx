import React from 'react'

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
        backgroundColor: getScoreBackground(score),
        color: getScoreColor(score),
        padding: '6px 12px',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '60px',
        border: `1px solid ${getScoreColor(score)}20`
      }}
    >
      {score}/{maxScore}
    </div>
  )
}
