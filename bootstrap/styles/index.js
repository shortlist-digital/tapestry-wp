import 'glamor/reset'
import { css } from 'glamor'

const wrapper = css({
  margin: '0 auto',
  maxWidth: '800px',
  padding: '40px'
})

const heading = css({
  fontSize: '28px',
  fontWeight: 600,
  marginBottom: '28px'
})

const date = css({
  fontSize: '16px',
  marginBottom: '20px'
})

const content = css({
  color: '#333',
  fontFamily: 'Georgia, serif',
  fontSize: '18px',
  lineHeight: '1.5',
  marginBottom: '20px',
  '& h3': {
    fontSize: '22px',
    fontFamily: 'Helvetica, sans-serif',
    lineHeight: '1.5',
    fontWeight: 600,
    marginTop: '24px',
    marginBottom: '8px'
  },
  '& a': {
    color: '#009688'
  }
})

export default {
  wrapper,
  heading,
  date,
  content
}
