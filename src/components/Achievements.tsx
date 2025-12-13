interface Achievement {
  suffix?: string
  metric: string
  value: number
  animateClass: string
}

const achievementsList: Achievement[] = [
  {
    metric: 'StackOverflow reputation',
    value: 1316,
    animateClass: 'animate-1316'
  },
  {
    metric: 'Certifications',
    value: 36,
    animateClass: 'animate-36'
  },
  {
    suffix: '+',
    metric: 'Publications',
    value: 24,
    animateClass: 'animate-24'
  },
  {
    suffix: '+',
    metric: 'Years of Experience',
    value: 6,
    animateClass: 'animate-6'
  }
]

const Achievements = () => {
  return (
    <div className="grid mb-20 sm:grid-cols-2 md:grid-cols-4 gap-4 gap-y-6 py-7 sm:border-gray-300 dark:sm:border-[#33353F] sm:border sm:rounded-md sm:py-8 sm:px-8 items-start justify-center text-center">
      {achievementsList.map((achievement) => (
        <div
          key={achievement.metric}
          className="flex-1 w-full flex flex-col sm:gap-2 md:gap-3 align-top items-center text-center justify-center"
        >
          <h2 className="text-gray-900 dark:text-white text-4xl font-bold flex flex-row">
            <span className={`number-animation ${achievement.animateClass}`} />
            {achievement.suffix && <span>{achievement.suffix}</span>}
          </h2>
          <p className="text-gray-700 dark:text-gray-400 text-base font-normal leading-tight">
            {achievement.metric}
          </p>
        </div>
      ))}
    </div>
  )
}

export default Achievements
