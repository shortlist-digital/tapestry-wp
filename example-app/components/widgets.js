import React from 'react'
import Paragraph from './paragraph'
import Image from './image'
import Heading from './heading'
import Missing from './missing'

const widgetMap = {
  'paragraph': Paragraph,
  'image': Image,
  'heading': Heading
}

const Widgets = ({widgets}) =>
  <div id='content-widgets'>
    {widgets.map((widget, index) => {
      let Widget = widgetMap[widget.acf_fc_layout]
      let RenderWidget = Widget ? Widget : Missing
      return <RenderWidget key={index} {...widget} />
    })}
  </div>

export default Widgets
