import DefaultTheme from 'vitepress/theme'
import './css/reset.css'
import 'virtual:windi.css'
import './css/custom.css'

export default {
  ...DefaultTheme,
  repo: 'Novout/pdfeasy',
  logo: 'public/logo.png',
  docsDir: '.',
  docsBranch: 'main',
  docsRepo: 'Novout/pdfeasy',
}
