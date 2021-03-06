import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyles = createGlobalStyle`
${reset}
  :root {
    height: 100vh;
    /* color */
  --red: #FF4E4E;
  --yellow: #FFC438;
  --green: #17A249;
  --purple: #8E41FF;
  --black: #222222;
  --black24: #242424;
  --gray66: #666666;
  --gray99: #999999;
  --grayc1: #c1c1c1;
  --grayc0: #C0C4C9;
  --graydf: #dfdfdf;
  --grayed: #EDEFF2;
  --white: #ffffff;
   --orange : #F05C2E;
  }
  body{
    position: relative;
    font-family: 'Noto Sans KR', sans-serif;
    margin: 0;
    padding: 0;
    height: 100vh;
  }
  html{
    margin : 0;
    padding: 0;
    box-sizing: border-box;
    height: 100vh;
  }

 `;


export default GlobalStyles;