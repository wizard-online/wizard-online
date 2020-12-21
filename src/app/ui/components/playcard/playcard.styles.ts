import { css } from "styled-components";
import { colors } from "../../util/colors";

export const playCardBaseStyles = css`
  border: 1px solid ${colors.grey};
  border-radius: 7px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 46px;
  height: 71px;
  font-family: "Almendra", serif;
  font-weight: 700;
`;
