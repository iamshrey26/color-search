import React,{Component} from 'react';
import './App.css';
import jsonData from "./colours.json";
import Fuse from 'fuse.js';
var convert = require('color-convert');
var isColor = require('is-color')

let data = jsonData.colors;

class App extends Component {
  state ={
    searchTerm: null,
    errorMesg: ''
  }

  handleUserInput = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      
      let keyword = e.target.value.toLowerCase();
      this.setState({
        searchTerm: keyword
      });    
    }
  }

  handleChange = (e) => {
    if ((e.target.value.charAt(0) !== '#') || (e.target.value.length !== 7)){
      this.setState({
        errorMesg: "Please, enter a valid css color."
      });
    }
    else{
      this.setState({
        errorMesg: ""
      });
    }
  }

  render() {

    const TableHeader = () => {
      return(
          <thead>
              <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Hex</th>
                  <th>RGB</th>
                  <th>CMYK</th>
              </tr>
          </thead>
      );
  }

  let cmykFormatArray = data.map(color => {
    let cmykArray=convert.hex.cmyk(color.hex)
    return(      
      cmykArray[0]+", "+ cmykArray[1].toString() +", "+ cmykArray[2].toString()+","+ cmykArray[3].toString()
    );
  })
  
  // let rgbFormatArray = data.map(color => {
  //   const rgbArray = convert.hex.rgb(color.hex)
  //   return(
  //     rgbArray[0] +', '+ rgbArray[1] +', '+ rgbArray[2]
  //   );
  // })

  const fuse = new Fuse(cmykFormatArray, {
    keys: [
      'cmyk'
    ],
    includeScore: true,
    threshold: 0.5,
    findAllMatches: true,
    shouldSort: true 
  });

  let colorsSearchList = [];
  if((this.state.searchTerm !== null) && (this.state.searchTerm.charAt(0) === '#') && (this.state.searchTerm.length ===7) && (isColor(this.state.searchTerm))){
    
    //const rgbConvert = convert.hex.rgb(this.state.searchTerm);
    const cmykConvert = convert.hex.cmyk(this.state.searchTerm);
    //const rgbString = rgbConvert[0].toString() +', '+ rgbConvert[1].toString() +', '+ rgbConvert[2].toString();
    const cmykString = cmykConvert[0].toString() +','+ cmykConvert[1].toString() +','+ cmykConvert[2].toString()+','+ cmykConvert[3].toString();
    const results = fuse.search(cmykString);
    console.log(results);
    colorsSearchList = results.slice(0,50).map (ref =>{ 
            
      let rgbFormat = convert.hex.rgb(data[ref.refIndex].hex);  
      let cmykFormat = convert.hex.cmyk(data[ref.refIndex].hex);
        return(
          <tr key={data[ref.refIndex].hex}>
            <td id="rectangle" bgcolor= {data[ref.refIndex].hex}></td>
            <td>{(data[ref.refIndex].color).trim()}</td>
            <td>{data[ref.refIndex].hex}</td>
            <td>{rgbFormat[0]}, {rgbFormat[1]}, {rgbFormat[2]}</td>
            <td> {cmykFormat[0]}, {cmykFormat[1]}, {cmykFormat[2]}, {cmykFormat[3]} </td>
        </tr>
      );      
    })
    
  }
    return(
      <div className="App">
        <header className="App-header">
        <h1>{message}</h1>
          <form onKeyDown={ this.handleUserInput }>
            <input type="text" id="searchTerm" name='searchTerm' onChange={this.handleChange}/>
            <p>{this.state.errorMesg}</p>
          </form>
          <table id="tableStyle">
            <TableHeader />
            <tbody>
              {colorsSearchList}
           </tbody>
          </table>
        </header>
      </div>
  );
}
}

const message = 'Colour Search';

export default App;
