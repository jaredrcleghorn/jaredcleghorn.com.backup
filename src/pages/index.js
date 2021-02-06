import React from "react"
import { graphql } from "gatsby"
import styles from "./index.module.scss"

export default function Home({ data }) {
  return (
    <>
      <h1 id={styles.header}>
        <span>&lt;</span>Jared Cleghorn&nbsp;<span>/&gt;</span>
      </h1>
      <main id={styles.main}>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <article key={node.id}>
            <h2>{node.frontmatter.title}</h2>
            <h3>{node.frontmatter.date}</h3>
            <div dangerouslySetInnerHTML={{ __html: node.html }} />
          </article>
        ))}
      </main>
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
