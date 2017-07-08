/* @flow */
import React, { Component } from 'react'
import PouchDB from 'pouchdb'
import Grid from 'material-ui/Grid'
import AppBar from 'material-ui/AppBar'
import { MuiThemeProvider } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
// import { Editor, EditorState } from 'draft-js'
import Button from 'material-ui/Button'
import uuid from 'uuid'

let db

class App extends Component {
  state: {
    docs: Array<Object>,
    value: string
  }
  constructor(){
    super()
    this.state = {
      docs: [],
      value: ''
    }
  }

  componentWillMount(){
    db = new PouchDB('local')
    db.sync('https://danwoods.cloudant.com/lifelog-dev', {
      live: true,
      retry: true
    }).on('change', info => {
      console.log('INFO', info)
      db.allDocs({ include_docs: true })
        .then(docs => { console.log(docs); this.setState({ docs: docs.rows }) })
    })

    db.allDocs({ include_docs: true })
      .then(docs => { console.log(docs); this.setState({ docs: docs.rows }) })

    db.changes().on('change', function() {
      console.log('Ch-Ch-Changes');
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <section className="App" style={{ width: 'calc(100vw - 32px)', height: '100vh', overflow: 'hidden', padding: '0 16px' }}>
          <AppBar className="App-header" position={ 'static' } style={{ width: '100vw', marginLeft: '-16px' }}>
            <Toolbar>
              <Typography type="title" color="inherit">
                Title
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid container gutter={ 16 } align={ 'flex-start' } style={{ marginTop: '16px' }}>
            <Grid item className="App-intro" xs={ 12 }>
              To get started, edit <code>src/App.js</code> and save to reload.
            </Grid>
            {
              this.state.docs.map(doc => <Grid item key={ doc.key } xs={ 12 }>{ doc.doc.name }</Grid>)
            }
            <Grid item xs={ 12 }>
              <TextField
                id="multiline-flexible"
                label="Multiline"
                multiline
                rowsMax="4"
                defaultValue="Default Value"
                value={ this.state.value }
                onChange={ (evt) => this.setState({ value: evt.target.value })}
              />
            </Grid>{
              /*

            <Grid item xs={ 12 }>
              <div className="editor-container" style={{ border: '1px solid gray' }}>
                <Editor editorState={ this.state.editorState } onChange={ (editorState) => this.setState({editorState}) } />
              </div>
            </Grid>
               */
            }
            <Grid item xs={ 12 } className="buttonContainer">
              <Button raised color="primary" onClick={ () => {
                console.log(this.state.value)
                db.put({
                  _id: uuid(),
                  name: this.state.value
                }).then(resp => {
                  if(resp.ok){
                    this.setState({ value: '' })
                  }
                }).catch(function (err) {
                  console.log(err);
                });
              }}>
                Save
              </Button>
            </Grid>
          </Grid>
        </section>
      </MuiThemeProvider>
    )
  }
}

export default App
