const path = require("path")
const config = require("./config/website")

const here = (...p) => path.join(__dirname, ...p)
const pathPrefix = config.pathPrefix === "/" ? "" : config.pathPrefix

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  pathPrefix: config.pathPrefix,
  siteMetadata: {
    siteUrl: config.siteUrl + pathPrefix,
    title: config.siteTitle,
    twitterHandle: config.twitterHandle,
    description: config.siteDescription,
    tags: ["AGYNAMIX", "Blogger", "Java", "Scala", "Javascript", "Typescript", "ReactJS"],
    canonicalUrl: config.siteUrl,
    image: config.siteLogo,
    author: {
      name: config.author,
      minibio: config.minibio,
    },
    organization: {
      name: config.organization,
      url: config.siteUrl,
      logo: config.siteLogo,
    },
    social: {
      twitter: config.twitterHandle,
      fbAppID: "",
    },
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/blog`,
        name: "blog",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src`,
        name: "src",
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        defaultLayouts: {
          default: here("./src/templates/markdown-page.js"),
        },
        extensions: [".mdx", ".md", ".markdown"],
        gatsbyRemarkPlugins: [
          { resolve: "gatsby-remark-copy-linked-files" },
          {
            resolve: "gatsby-remark-images",
            options: {
              backgroundColor: "#fafafa",
              maxWidth: 1035,
            },
          },
          { resolve: require.resolve("./plugins/remark-embedder") },
          // {
          //   resolve: "gatsby-remark-embed-gist",
          //   options: {
          //     username: "tuhlmann"
          //   }
          // }
        ],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-emotion",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: config.siteTitle,
        short_name: config.siteTitleShort,
        description: config.siteDescription,
        start_url: config.pathPrefix,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: "standalone",
        icons: [
          {
            src: "/favicons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    },
    // {
    //   resolve: "gatsby-plugin-google-analytics",
    //   options: {
    //     trackingId: config.googleAnalyticsID,
    //     anonymize: true,
    //     respectDNT: true,
    //   },
    // },
    getBlogFeed({
      filePathRegex: "//content/blog//",
      blogUrl: "https://www.agynamix.de/blog",
      overrides: {
        output: "/blog/rss.xml",
        title: "AGYNAMIX Blog RSS Feed",
      },
    }),
    {
      resolve: "gatsby-plugin-typography",
      options: {
        pathToConfigModule: "src/lib/typography",
      },
    },
    "gatsby-plugin-offline",
    {
      resolve: "gatsby-plugin-typescript",
      options: {
        isTSX: false, // defaults to false
        jsxPragma: "React", // defaults to "React"
        allExtensions: false, // defaults to false
      },
    },
    "gatsby-plugin-typescript-checker",
    // "gatsby-transformer-hjson"
  ],
}

function getBlogFeed({ filePathRegex, blogUrl, overrides }) {
  return {
    resolve: "gatsby-plugin-feed",
    options: {
      query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
      feeds: [
        {
          serialize: ({ query: { site, allMdx } }) => {
            const stripSlash = slug => (slug.startsWith("/") ? slug.slice(1) : slug)
            return allMdx.edges.map(edge => {
              const siteUrl = site.siteMetadata.siteUrl
              const url = `${siteUrl}/${stripSlash(edge.node.fields.slug)}`

              const postText = `<div style="margin-top=55px; font-style: italic;">(This article was posted to my blog at <a href="${blogUrl}">${blogUrl}</a>. You can <a href="${url}">read it online by clicking here</a>.)</div>`

              // Hacky workaround for https://github.com/gaearon/overreacted.io/issues/65
              const html = edge.node.html
                .replace(/href="\//g, `href="${siteUrl}/`)
                .replace(/src="\//g, `src="${siteUrl}/`)
                .replace(/"\/static\//g, `"${siteUrl}/static/`)
                .replace(/,\s*\/static\//g, `,${siteUrl}/static/`)

              return {
                ...edge.node.frontmatter,
                description: edge.node.excerpt,
                date: edge.node.fields.date,
                url,
                guid: url,
                custom_elements: [{ "content:encoded": html + postText }],
              }
            })
          },
          query: `
            {
              allMdx(
                limit: 1000,
                filter: {
                  frontmatter: {published: {ne: false}}
                  fileAbsolutePath: {regex: "${filePathRegex}"}
                }
                sort: { order: DESC, fields: [frontmatter___date] }
              ) {
                edges {
                  node {
                    excerpt(pruneLength: 250)
                    html
                    fields {
                      slug
                      date
                    }
                    frontmatter {
                      title
                    }
                  }
                }
              }
            }
          `,
          ...overrides,
        },
      ],
    },
  }
}
