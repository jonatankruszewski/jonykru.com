'use client'

import { useI18n } from '@/context/i18nContext'

interface Achievement {
  suffix?: string
  metricKey: string
  value: number
  animateClass: string
  icon: string
}

const achievementsList: Achievement[] = [
  {
    metricKey: 'achievements.stackOverflowReputation',
    value: 1316,
    animateClass: 'animate-1316',
    icon: '🏆'
  },
  {
    metricKey: 'achievements.certifications',
    value: 36,
    animateClass: 'animate-36',
    icon: '📜'
  },
  {
    suffix: '+',
    metricKey: 'achievements.publications',
    value: 24,
    animateClass: 'animate-24',
    icon: '✍️'
  },
  {
    suffix: '+',
    metricKey: 'achievements.yearsOfExperience',
    value: 6,
    animateClass: 'animate-6',
    icon: '💼'
  }
]

const Achievements = () => {
  const { t } = useI18n()

  return (
    <div className="grid mt-8 mb-16 grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {achievementsList.map((achievement) => (
        <div
          key={achievement.metricKey}
          className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1a1a2e] dark:to-[#16162a] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="absolute top-3 end-3 text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
            {achievement.icon}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 text-transparent bg-clip-text flex items-baseline">
              <span
                className={`number-animation ${achievement.animateClass}`}
              />
              {achievement.suffix && <span>{achievement.suffix}</span>}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-snug">
              {t(achievement.metricKey)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Achievements
