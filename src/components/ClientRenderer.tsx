import React from "react"
import {css} from "@emotion/core"
import {isEmpty} from "lodash"
import Markdown from "react-markdown"
import {bpMaxSM} from "../lib/breakpoints"
import slugify from "@sindresorhus/slugify"
import {ClientData, formatDate} from "../lib/prepare-client-data"
import theme from "../../config/theme"

interface IProps {
  clients: ClientData[]
}

function renderImage(url?: string, img?: any) {
  if (img) {
    const i = <img css={{maxWidth: 200}} src={img} />
    if (url) {
      return (
        <div>
          <a href={url}>{i}</a>
        </div>
      )
    }
    return <div>{i}</div>
  }
  return null
}

export const ClientRenderer: React.FC<IProps> = ({clients}) => {
  return (
    <React.Fragment>
      {clients.map(({position, client, logo: img, start, end, slug, description, url, tags}) => {
        const niceStart = formatDate(start)
        const niceEnd = formatDate(end)
        return (
          <div
            key={slug}
            css={css`
              background: white;
              border-radius: 10px;
              padding: 40px;
              ${bpMaxSM} {
                padding: 20px;
              }
              margin-bottom: 20px;
              ul {
                list-style: none;
                margin: 0;
              }
              h4 {
                text-transform: uppercase;
                opacity: 0.6;
                font-size: 13px;
                letter-spacing: 1px;
                line-height: 34px;
                margin: 0;
              }
              h2 {
                margin: 0;
                margin-right: 5px;
                flex: 1 1;
                ${bpMaxSM} {
                  margin-bottom: 10px;
                }
                ${bpMaxSM} {
                  max-width: 100%;
                }
              }
              hr {
                margin: 20px 0;
                opacity: 0.5;
              }
              li > time {
                float: right;
                font-size: 14px;
                opacity: 0.8;
              }
              li {
                display: flex;
                align-items: center;
                margin: 0;
                margin-bottom: 10px;
                justify-content: space-between;
              }

              .tags {
                display: flex;
                flex-wrap: wrap;
                margin: 0 -2.5px 0 -2.5px;
                ${bpMaxSM} {
                  display: none;
                  visibility: invisible;
                }
              }

              .tag {
                padding: 1px 8px;
                background: white;
                border: 1px solid #f1f1f1;
                border-radius: 15px;
                font-size: 16px;
                margin: 2.5px;
                background-color: ${theme.colors.background_color};
                ${bpMaxSM} {
                  padding: 6px 8px;
                  font-size: 14px;
                }
              }

              img {
                margin-bottom: 0;
              }
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                ${bpMaxSM} {
                  flex-direction: column-reverse;
                  align-items: flex-start;
                }
                a {
                  color: inherit;
                }
              `}
            >
              <div>
                <h2>
                  <a href={`#${slug}`} id={slug}>
                    {position}
                  </a>
                </h2>
                <h4>
                  {client};
                  <small>
                    {" "}
                    {niceStart} -> {niceEnd}
                  </small>
                </h4>
              </div>
              {renderImage(url, img)}
            </div>
            <div>
              <div className="tags">
                {tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <hr />
            <div
              css={css`
                margin-top: 20px;
                font-size: 16px;
              `}
            >
              <Markdown source={description} />
            </div>

            {/* {!isEmpty(deliveries) && <h4>Presentations</h4>}
            <ul>
              {deliveries.map((delivery, index) => (
                <li key={index}>
                  <div
                    css={{
                      display: "flex",
                      alignItems: "center",
                      "& > p": {marginBottom: 0}
                    }}
                  >
                    <Markdown source={delivery.event} />
                    {delivery.recording ? (
                      <a css={{fontSize: "0.8rem", marginLeft: 10}} href={delivery.recording}>
                        <span role="img" aria-label="recording">
                          📺
                        </span>
                      </a>
                    ) : null}
                  </div>
                  <time>{delivery.date}</time>
                </li>
              ))}
            </ul>
            {!isEmpty(resources) && <h4>Resources</h4>}
            <ul>
              {resources.map((resource, i) => (
                <li key={i}>
                  <Markdown source={resource} />
                </li>
              ))}
            </ul> */}
          </div>
        )
      })}
    </React.Fragment>
  )
}