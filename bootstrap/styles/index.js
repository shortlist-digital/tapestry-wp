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
  '& h3': {
    fontSize: '24px',
    lineHeight: '1.5',
    fontWeight: 600,
    marginTop: '24px',
    marginBottom: '8px'
  },
  '& p': {
    color: '#333',
    fontFamily: 'Georgia, sans-serif',
    fontSize: '18px',
    lineHeight: '1.5',
    marginBottom: '20px'
  },
  '& a': {
    color: '#009688'
  },
  '& figure': {
    borderBottom: '1px solid #e5e5e5',
    marginBottom: '24px',
    paddingBottom: '16px'
  },
  '& figcaption': {
    color: '#333',
    fontSize: '13px',
    lineHeight: '1.5',
    marginTop: '16px'
  }
})

export default {
  wrapper,
  heading,
  date,
  content
}
