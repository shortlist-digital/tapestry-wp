import React, { Component } from 'react'
import fetchData from '../../src/fetch-data'

const FrontPage = props =>
  <div>
    <h1>{props.data.title.rendered}</h1>
  </div>

export default fetchData(FrontPage)
