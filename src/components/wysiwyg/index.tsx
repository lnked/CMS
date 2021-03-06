import * as React from 'react'
import { Editor } from '@tinymce/tinymce-react'
// import { TINYMCE_API_KEY } from 'settings'

// <Editor apiKey='YOUR_API_KEY' init={{ /* your other settings */ }} />
// <Editor apiKey='YOUR_API_KEY' cloudChannel='dev' init={{ /* your other settings */ }} />

class Wysiwyg extends React.Component {

  handleEditorChange = (e) => {
    console.log('Content was updated:', e.target.getContent())
  }

  render () {
    return (
      <Editor
        initialValue="<p>This is the initial content of the editor</p>"
        init={{
          plugins: 'link image code',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
        }}
        onChange={this.handleEditorChange}
      />
    )
  }

}

export default Wysiwyg
export { Wysiwyg }
