import React from "react"
import Container from "components/Container"
import SEO from "components/SEO"
import Layout from "components/Layout"
import BigHero from "components/big-hero"
import theme from "../../config/theme"

function MarkdownPage({ children, pageContext: { frontmatter } }) {
  return (
    <>
      <SEO frontmatter={frontmatter} />
      <Layout
        pageTitle={frontmatter.title}
        hero={
          frontmatter.useBigHero ? (
            <BigHero message={frontmatter.heroMessage} />
          ) : (
              undefined
            )
        }
        noFooter={frontmatter.noFooter}
        frontmatter={frontmatter}
        headerColor={theme.colors.black}
      >
        <Container>{children}</Container>
      </Layout>
    </>
  )
}

export default MarkdownPage
