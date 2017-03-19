import React, { Component } from 'react'
import { css } from 'glamor'
import fetchData from '../../src/fetch-data'

const Page = (props) =>
  <div className={css({ color:  '#bada55'})}>
    Test
  </div>

export default fetchData(Page)
