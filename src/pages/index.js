import React from "react"
import { graphql } from "gatsby"

export default function Home({ data }) {
  return (
    <>
      <h1>&lt;Jared Cleghorn /&gt;</h1>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <React.Fragment key={node.id}>
          <h2>{node.frontmatter.title}</h2>
          <h3>{node.frontmatter.date}</h3>
          <div dangerouslySetInnerHTML={{ __html: node.html }} />
        </React.Fragment>
      ))}
    </>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM D, YYYY")
          }
          html
        }
      }
    }
  }
`
