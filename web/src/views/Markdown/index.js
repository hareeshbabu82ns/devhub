import React, { Component } from 'react';

import Editor from '../../../views/markdown-editor.js';
import ReactMarkdown from 'react-markdown';

import CodeBlock from './code-block';

import './styles.css';


class Markdown extends Component {
  constructor(props) {
    super();
    this.state = {
      markdownSrc: "# Hello World",
    }
    this.onMarkdownChange = this.onMarkdownChange.bind(this);
  }

  onMarkdownChange(md) {
    this.setState((newState)=>({
      markdownSrc: md
    }));
  }

  render() {
    return (
      <div className="animated fadeIn row">
        <div className="col editor-pane">
          <Editor className="editor" value={this.state.markdownSrc}
                onChange={this.onMarkdownChange}/>
        </div>
        <div className="col view-pane">
          <ReactMarkdown className="markdownPane" source={this.state.markdownSrc} 
            renderers={{code: CodeBlock}}/>
        </div>
      </div>
    )
  }
}

export default Markdown;