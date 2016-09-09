import React from 'react'
import Paragraph from './paragraph'
import Image from './image'
import Heading from './heading'

const widgetMap = {
  'paragraph': Paragraph,
  'image': Image,
  'heading': Heading
}

let WidgetMissing = (props) =>
  <div>
    <hr />
    <h3>Uh oh... Widget Missing</h3>
    <pre>
      <code>
        {JSON.stringify(props, null, 2)}
      </code>
    </pre>
    <hr />
  </div>

let Widgets = ({widgets}) =>
  <div id='content-widgets'>
    {widgets.map((widget, index) => {
      let Widget = widgetMap[widget.acf_fc_layout]
      let RenderWidget = Widget ? Widget : WidgetMissing
      return <RenderWidget key={index} {...widget} />
    })}
  </div>

export default Widgets
