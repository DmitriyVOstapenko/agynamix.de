import { css } from "@emotion/core"
import styled from "@emotion/styled"
import { graphql } from "gatsby"
import React from "react"
import ReactDOM from "react-dom"
import theme from "../../config/theme"
import website from "../../config/website"
import { SimpleHero } from "../components/simple-hero"
import { Container, FullWidthContainer } from "../components/Container"
import Layout from "../components/Layout"
import { Link } from "../components/Link"
import SEO from "../components/SEO"
import { bpMaxMD, bpMaxSM } from "../lib/breakpoints"
import parseQueryString from "../lib/parse-query-string"
import { fonts, rhythm } from "../lib/typography"

import photoOfTorsten from "../images/torsten_square.jpg"

interface IProps {
  backgroundColor: string
  image: string
  title: string
  description?: string
  link: string
  big?: boolean
}

const Card: React.SFC<IProps> = ({backgroundColor = "#E75248", image, title, description, link, big = false}) => (
  <Link
    to={link}
    aria-label={`View ${title}`}
    css={css`
      * {
        color: white;
        margin: 0;
      }
      display: flex;
      justify-content: space-between;
      align-items: center;
      h4 {
        font-size: 22px;
        padding: ${big ? "0 20px 0 40px" : "40px 40px 0 40px"};
      }
      p {
        padding: 20px 40px 0 40px;
        font-size: 16px;
        opacity: 0.85;
        ${bpMaxSM} {
          padding: 20px 20px 0 40px;
        }
      }
      ${bpMaxMD} {
          flex-direction: column;
          align-items: center;
          ${big &&
            `
          text-align: center;
          h4 {
            padding: 40px 40px 0 40px;
          }
          img {
            width: 100%;
          }
          p {
            padding-bottom: 40px;
          }
          `}
        }
      ${!big &&
        `
        align-items: flex-start;
        flex-direction: column; 
        img {
          margin-top: 20px;
        }
        ${bpMaxMD} {
          align-items: center;
          img {
            width: 100%;
          }
         h4 {
           padding: 40px 0 0 0;
         }
        }
      `}
      background: ${backgroundColor};
      overflow: hidden;
      border-radius: 5px;
      margin-bottom: ${big ? "20px" : "20px"};
      img {
        transition: ${theme.transition.ease};
      }
      @media (hover: hover) {
      :hover:not(.touch) {
        transform: scale(1.03);
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.15);
      }
      }
    `}
  >
    <div>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
    </div>
    <img src={image} alt={title} />
  </Link>
)

const PostTitle = styled.h3`
  margin-bottom: ${rhythm(0.3)};
  transition: ${theme.transition.ease};
  font-size: 22px;
  font-family: ${fonts.regular};
  :hover {
    color: ${theme.brand.primary};
    transition: ${theme.transition.ease};
  }
`

const Description = styled.p`
  margin-bottom: 10px;
  display: inline-block;
`

// this component is one big shrug. I didn't have time to get good at animation
// and it's such a simple single-use component hack something I could ship...
function SubscribeConfirmation() {
  const portalContainerRef = React.useRef<HTMLElement>()
  const [showMessage, setShowMessage] = React.useState(false)
  const [animateIn, setAnimateIn] = React.useState(false)
  React.useEffect(() => {
    portalContainerRef.current = document.createElement("div")
    Object.assign(portalContainerRef.current.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 11
    })
    document.body.append(portalContainerRef.current)
  }, [])

  React.useEffect(() => {
    if (parseQueryString(window.location.search).hasOwnProperty("subscribed")) {
      setTimeout(() => {
        setShowMessage(true)
        setTimeout(() => {
          setShowMessage(false)
        }, 4500)
      }, 200)
    }
  }, [])
  React.useEffect(() => {
    if (showMessage) {
      setAnimateIn(true)
      setTimeout(() => setAnimateIn(false), 4000)
    }
  }, [showMessage])

  if (showMessage) {
    return ReactDOM.createPortal(
      <button
        onClick={() => setAnimateIn(false)}
        css={css`
          border-radius: 0;
          width: 100%;
          padding: 20px;
          display: flex;
          justify-content: center;
          background-color: ${theme.colors.green};
          color: ${theme.colors.primary_light};
          transition: 0.3s;
          transform: translateY(${animateIn ? "0" : "-85"}px);
        `}
      >
        Thanks for subscribing!
      </button>,
      portalContainerRef.current!
    )
  } else {
    return null
  }
}

interface IRoundLinkProps {
  background: string
  link: string
  text: string
}

const RoundLink: React.SFC<IRoundLinkProps> = ({background, link, text}) => {
  return (
    <Link to={link}>
      <div
        css={{
          width: 130,
          height: 130,
          display: "flex",
          margin: 5,
          background,
          backgroundPosition: "center",
          backgroundSize: "contain",
          borderRadius: "50%",
          justifyItems: "center",
          padding: 10
        }}
      >
        <span
          css={{
            margin: "auto",
            textAlign: "center",
            color: "white",
            opacity: 0.8,
            "&:hover": {
              opacity: 1
            }
          }}
        >
          {text}
        </span>
      </div>
    </Link>
  )
}

export default function Index() {
  return (
    <Layout headerColor={theme.colors.black} hero={<SimpleHero />} pageTitle="AGYNAMIX - Passionate Software">
      <SEO />
      <SubscribeConfirmation />
      <Container
        maxWidth={1200}
        css={css`
          display: flex;
          justify-content: space-evenly;
          position: relative;
          padding-bottom: 0;
          background: ${theme.colors.background_color};
          border-radius: 5px;
          padding: 100px 120px 60px 120px;
          margin-bottom: ${rhythm(1)};
          width: 950px;
          h2 {
            margin-bottom: ${rhythm(1.5)};
          }
        `}
      >
        <div css={{alignSelf: "center", maxWidth: "220px"}}>
          <img
            src={photoOfTorsten}
            alt="Torsten Uhlmann"
            css={{
              marginBottom: 0,
              borderRadius: 5,
              maxWidth: "90%"
            }}
          />
        </div>
        <div css={{maxWidth: 400, alignContent: "center"}}>
          <div>
            <h3 css={{marginTop: 0}}>My name is Torsten.</h3>
            <p css={{fontSize: "24px"}}>
              I'm a Full Stack software developer working with Scala, Java, Clojure, Typescript and many other things.
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}
