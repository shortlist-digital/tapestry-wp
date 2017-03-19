import React, { Component } from 'react'
import fetchData from '../../src/fetch-data'

const FrontPage = ({data}) =>
  <div>
    <h1>{data.title.rendered}</h1>
  </div>

export default FrontPage
