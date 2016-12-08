import React from 'react'
import { Route, IndexRoute } from 'react-router'

export default ({ Base, Post }) =>
  <Route component={Base}>
    <Route path="*" component={Post} />
  </Route>