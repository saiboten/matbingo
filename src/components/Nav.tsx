import React, { useState } from "react";
import { StyledHamburger } from "./StyledHamburger";
import { StyledSecondaryActionButton } from "./StyledActionButton";
import styled from "styled-components";
import { minBreakPoint, primaryColor } from "./Constants";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { firebase } from "../firebase/firebase";

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

  @media screen and (max-width: ${minBreakPoint}px) {
    padding: 5px 0;
  }

  &:hover {
    border: 2px solid grey;
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
  background-color: ${primaryColor};
  align-items: center;
  font-size: 20px;
  pointer-events: auto;

  @media screen and (max-width: ${minBreakPoint}px) {
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
  }
`;

const StyledLeftItemLi = styled.li`
  margin-right: auto;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin-right: 0;
  }
`;

const LogOut = (setLoggedIn: () => void) => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });
  setLoggedIn();
};

export const Nav = ({ setLoggedIn }: { setLoggedIn: () => void }) => {
  const [menuActive, setMenuActive] = useState(false);

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
            <StyledLink to="/">Food-Eureka!</StyledLink>
          </StyledLeftItemLi>
          <StyledLi>
            <StyledLink onClick={() => setMenuActive(false)} to="/recipes">
              Oppskrifter
            </StyledLink>
          </StyledLi>
          {/* <StyledLi>
            <StyledLink onClick={() => setMenuActive(false)} to="/ingredients/">
              Ingredienser
            </StyledLink>
          </StyledLi> */}
          <StyledLi>
            <StyledLink onClick={() => setMenuActive(false)} to="/">
              Ukesmeny
            </StyledLink>
          </StyledLi>
          <StyledLi>
            <StyledSecondaryActionButton
              onClick={() => {
                setMenuActive(false);
                LogOut(setLoggedIn);
              }}
            >
              Logg ut
            </StyledSecondaryActionButton>
          </StyledLi>
        </StyledUl>
      </StyledTranslateResetDesktop>
      <StyledNav style={props} onClick={() => setMenuActive(false)} />
    </>
  );
};
