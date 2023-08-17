import './style.css'

import { exampleSetup } from 'prosemirror-example-setup'
import { DOMParser, Schema } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

let nodes = schema.spec.nodes

nodes = nodes.update('blockquote', {
  content: 'block+',
  group: 'block',
  definingForContent: true,
  definingAsContext: false,
  attrs: {
    color: {
      default: 'black',
    },
  },
  parseDOM: [
    {
      tag: 'blockquote',
      getAttrs(node) {
        const dom = node as HTMLElement
        const color =
          dom.getAttribute('data-color') || dom.style.color || 'black'
        return { color }
      },
    },
  ],
  toDOM(node) {
    const color = node.attrs.color || 'black'
    return [
      'blockquote',
      {
        'data-color': color,
        style: `border-left: 5px solid ${color};`,
      },
      0,
    ]
  },
})

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: nodes,
  marks: schema.spec.marks,
})

const view = new EditorView(document.querySelector('#editor'), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(
      document.querySelector('#content')!
    ),
    plugins: exampleSetup({ schema: mySchema }),
  }),
})

;(window as any).view = view
