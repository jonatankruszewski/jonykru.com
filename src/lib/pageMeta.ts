import type { Locale } from '@/lib/locale'

export type PageKey =
  | 'home'
  | 'openSource'
  | 'blog'
  | 'certifications'
  | 'contact'

export type PageMeta = { title: string; description: string }

const NAME = 'Jonatan Kruszewski'

/**
 * Per-locale SEO copy for each route. `home.title` is absolute; every other
 * title gets the site name appended by `titleFor`. Kept in one typed table so
 * the three languages stay in lockstep (a test asserts parity).
 */
export const PAGE_META: Record<Locale, Record<PageKey, PageMeta>> = {
  en: {
    home: {
      title: `${NAME} — Software Engineer`,
      description:
        'Software engineer who takes AI systems past the demo — frontend, backend, CI and automation. Author of the rxova libraries; contributor to immer, typedash and Pane.'
    },
    openSource: {
      title: 'Open Source',
      description:
        'Libraries I wrote and maintain under the rxova org, plus fixes merged into codebases I do not own — immer, typedash and Pane, an open-source AI agent manager.'
    },
    blog: {
      title: 'Blog Posts',
      description:
        'Essays on Medium about architecture, migrations, TypeScript and the real cost of tech debt — written to learn it twice, and to pay back the posts that got me unstuck.'
    },
    certifications: {
      title: 'Certifications',
      description:
        '33 exams graded by someone other than me — thirteen from Scrum.org, plus AWS, Microsoft Azure, Google Cloud, GitHub, GitLab, MongoDB and the Python Institute.'
    },
    contact: {
      title: 'Contact',
      description:
        'Book a call — twenty minutes, no slides. Bring the thing that is stuck. Or send a message and I will reply within a couple of days.'
    }
  },
  es: {
    home: {
      title: `${NAME} — Ingeniero de Software`,
      description:
        'Ingeniero de software que lleva la IA más allá de la demo: frontend, backend, CI y automatización. Autor de las librerías rxova; colaborador en immer, typedash y Pane.'
    },
    openSource: {
      title: 'Código Abierto',
      description:
        'Librerías que escribí y mantengo bajo la organización rxova, más arreglos mergeados en repos que no son míos — immer, typedash y Pane, un gestor de agentes de IA de código abierto.'
    },
    blog: {
      title: 'Entradas de Blog',
      description:
        'Ensayos en Medium sobre arquitectura, migraciones, TypeScript y el costo real de la deuda técnica — escritos para aprenderlo dos veces, y para devolver los posts que me destrabaron.'
    },
    certifications: {
      title: 'Certificaciones',
      description:
        '33 exámenes corregidos por alguien que no soy yo — trece de Scrum.org, más AWS, Microsoft Azure, Google Cloud, GitHub, GitLab, MongoDB y el Python Institute.'
    },
    contact: {
      title: 'Contacto',
      description:
        'Agendá una llamada — veinte minutos, sin slides. Traé lo que está trabado. O escribime un mensaje y te respondo en un par de días.'
    }
  },
  he: {
    home: {
      title: `${NAME} — מהנדס תוכנה`,
      description:
        'מהנדס תוכנה שלוקח מערכות AI מעבר לדמו — פרונטאנד, בקאנד, CI ואוטומציה. מחבר ספריות rxova; תורם ל-immer, typedash ו-Pane.'
    },
    openSource: {
      title: 'קוד פתוח',
      description:
        'ספריות שכתבתי ומתחזק תחת ארגון rxova, ועוד תיקונים שמוזגו לרפוזיטוריז שאינם שלי — immer, typedash ו-Pane, מנהל סוכני AI בקוד פתוח.'
    },
    blog: {
      title: 'בלוג',
      description:
        'מאמרים ב-Medium על ארכיטקטורה, מיגרציות, TypeScript והמחיר האמיתי של חוב טכני — נכתבו כדי ללמוד את זה פעמיים, וכדי להחזיר על הפוסטים שחילצו אותי.'
    },
    certifications: {
      title: 'הסמכות',
      description:
        '33 מבחנים שנבדקו בידי מישהו שאינו אני — שלושה עשר מ-Scrum.org, ועוד AWS, Microsoft Azure, Google Cloud, GitHub, GitLab, MongoDB ו-Python Institute.'
    },
    contact: {
      title: 'צור קשר',
      description:
        'לקביעת שיחה — עשרים דקות, בלי מצגות. תביא את מה שתקוע. או שלח הודעה ואחזור אליך תוך יומיים.'
    }
  }
}

/** Absolute page title: home is already whole, the rest get the name appended. */
export const titleFor = (locale: Locale, page: PageKey): string => {
  const { title } = PAGE_META[locale][page]
  return page === 'home' ? title : `${title} — ${NAME}`
}
