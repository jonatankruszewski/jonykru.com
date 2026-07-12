// Applies the saved theme before first paint, so the page never flashes the
// wrong canvas. Loaded with next/script strategy="beforeInteractive" from the
// root layout — kept as a real file rather than an inline string so the app
// carries no dangerouslySetInnerHTML.
//
// Dark-first: the design is an IDE. Only an explicit OS light preference,
// or an explicit choice saved by the theme toggle, opts out.
;(function () {
  try {
    var theme = localStorage.getItem('theme')

    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
    }

    document.documentElement.classList.toggle('dark', theme === 'dark')
  } catch (error) {
    // localStorage unavailable (private mode, blocked cookies) — fall back to
    // the dark default already implied by the markup.
  }
})()
