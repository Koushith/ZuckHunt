import styled from "styled-components";

export const ViewQuestContainer = styled.div`
  font-family: "Londrina Solid", "sans-serif";
  
  margin: 0 auto;

.main-container{
  margin-top:30px;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
}

  .container {
    margin-top: 20px;

    .card {
      gap: 10px;
      margin-bottom:20px;
      max-width:600px;
      display: flex;
      img {
        height: 80px;
        width: 80px;
      }

      .info {
        p {
          font-size: 14px;
          color: #646464;
        }
      }
    }
  }
`