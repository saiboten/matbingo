import React, { useState, useContext } from "react";
import styled from "styled-components";
import { SettingsSharp, ShoppingCart } from "@material-ui/icons";
import { StyledHamburger } from "./StyledHamburger";
import { minBreakPoint, secondaryColor } from "./Constants";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { UserDataContext } from "../context/UserDataContext";

const StyledNav = styled(animated.nav)`
  display: none;

  @media screen and (max-width: ${minBreakPoint}px) {
    display: block;
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 5;
  }
`;

const StyledLi = styled.li`
  margin-right: 5px;
  padding: 20px 0;
  border: 2px solid transparent;
  margin: 10px 0;

  @media screen and (max-width: ${minBreakPoint}px) {
    padding: 5px 0;
  }
`;

const StyledLink = styled(Link)`
  &:visited,
  &:link {
    color: #f3f3f3;
    text-decoration: none;
  }
  padding: 10px;
`;

interface ActiveProps {
  active: boolean;
}

const StyledTranslateResetDesktop = styled.div<ActiveProps>`
  transform: translateX(100vw);

  @media screen and (max-width: ${minBreakPoint}px) {
    position: fixed;
    transform: translateX(0);
    width: 70vw;
    height: 100vh;
    z-index: 10;
    pointer-events: none;
  }
`;

const StyledUl = styled(animated.ul)`
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
  background-color: ${secondaryColor};
  align-items: center;
  padding-left: 3rem;
  font-size: 20px;
  pointer-events: auto;

  @media screen and (max-width: ${minBreakPoint}px) {
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    align-items: flex-start;
  }
`;

const StyledLeftItemLi = styled.li`
  margin-right: auto;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin: 40px 0;
    margin-right: 0;
    padding-top: 0;
  }
`;

const NavLinkMobile = styled.span`
  @media screen and (min-width: ${minBreakPoint}px) {
    display: none; 
  }
`;
const NavLinkDesktop = styled.span`
  @media screen and (max-width: ${minBreakPoint}px) {
    display: none;
  }
`;

export const Nav = () => {
  const [menuActive, setMenuActive] = useState(false);

  const userdata = useContext(UserDataContext).userdata;
  const hasSelectedGroup = userdata.group !== "";

  const props = useSpring({
    transform: `translateX(${menuActive ? `0vh` : `-100vw`})`
  });

  return (
    <>
      <StyledHamburger
        onClick={() => setMenuActive(!menuActive)}
        active={menuActive}
      />
      <StyledTranslateResetDesktop active={menuActive}>
        <StyledUl style={props}>
          <StyledLeftItemLi>
            <StyledLink onClick={() => setMenuActive(false)} to="/">
              Matbingo.no
            </StyledLink>
          </StyledLeftItemLi>
          {hasSelectedGroup && (
            <>
              <StyledLi>
                <StyledLink onClick={() => setMenuActive(false)} to="/">
                  Ukesmeny
                </StyledLink>
              </StyledLi>
              <StyledLi>
                <StyledLink onClick={() => setMenuActive(false)} to="/recipes">
                  Oppskrifter
                </StyledLink>
              </StyledLi>
            </>
          )}
          <StyledLi>
            <StyledLink onClick={() => setMenuActive(false)} to="/shopping-list">
              <NavLinkMobile>
                Handleliste
              </NavLinkMobile>
              <NavLinkDesktop>
                <ShoppingCart fontSize="large" />
              </NavLinkDesktop>
            </StyledLink>
          </StyledLi>
          <StyledLi>
            <StyledLink onClick={() => setMenuActive(false)} to="/settings">
              <NavLinkMobile>
                Innstillinger
              </NavLinkMobile>
              <NavLinkDesktop>
                <SettingsSharp fontSize="large" />
              </NavLinkDesktop>
            </StyledLink>
          </StyledLi>
        </StyledUl>
      </StyledTranslateResetDesktop>
      <StyledNav style={props} onClick={() => setMenuActive(false)} />
    </>
  );
};
