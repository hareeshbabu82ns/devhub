import React, { Component } from 'react';
import CodeMirror from '@skidding/react-codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/markdown/markdown');


class Editor extends Component {
  constructor(props) {
    super(props);
    this.updateCode = this.updateCode.bind(this);
  }
  updateCode(e) {
    this.props.onChange(e);
  }
  render() {
    var options = {
      mode: 'markdown',
      theme: 'monokai',
    }
    return (
      <CodeMirror value={this.props.value} 
        onChange={this.updateCode}
        options={options} height="100%"
        />
    );
  }
}
export default Editor;