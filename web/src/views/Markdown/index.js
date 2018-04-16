import React, { Component } from 'react';
import { Grid } from "semantic-ui-react";

import Editor from './markdown-editor.js';
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
      <Grid columns={2} divided inverted padded>
        <Grid.Row stretched>
        <Grid.Column color='black'>
          <Editor className="editor" value={this.state.markdownSrc}
                onChange={this.onMarkdownChange}/>
        </Grid.Column>
        <Grid.Column color='black'>
          <ReactMarkdown className="markdownPane" source={this.state.markdownSrc} 
            renderers={{code: CodeBlock}}/>
        </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Markdown;