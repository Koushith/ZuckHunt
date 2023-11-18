import { styled } from "styled-components"

export const SideBarContainer = styled.aside`
  min-width: 200px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 1rem;
  margin-left: 6rem;
  ul {
    li {
      display: flex;
      gap: 0.6rem;
      align-items: center;

      margin-bottom: 1rem;
    }
  }
`
