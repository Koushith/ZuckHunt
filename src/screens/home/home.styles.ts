import styled from "styled-components";

export const HomeContainer = styled.div`
 font-family: 'Londrina Solid', 'sans-serif';
 .header{
  position: relative;
  z-index: 9999;
  padding:1rem;
  display:flex;
  align-items:center;
  justify-content:space-between;
  background:#2B83F6;
  color: #F3322C;
  // opacity: 0.8

}
h1{
 font-size:20px;
 
}

.btn{
 
  font-family: 'Londrina Solid', 'sans-serif';
      display: block;
    padding: 0.5rem 1rem;
    background-color: #0d6efd;
    color:white;
    text-decoration: none;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out;
}
`