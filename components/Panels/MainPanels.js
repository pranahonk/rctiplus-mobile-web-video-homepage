import React from "react";
import dynamic from "next/dynamic"

const Panel1 = dynamic(() => import("./Pnl_1"))
const Panel2 = dynamic(() => import("./Pnl_2"))
const Panel3 = dynamic(() => import("./Pnl_3"))
const Panel4 = dynamic(() => import("./Pnl_4"))
const SquareImage = dynamic(() => import("./SquareImage"))

export default class MainPanels extends React.Component {
  state = {
    contents: this.props.contents || [],
    token: this.props.token,
    loadingBar: this.props.loadingBar,
    imagePath: this.props.imagePath || "",
    resolution: this.props.resolution
  }

  render() {
    const { contents, token, loadingBar, imagePath, resolution } = this.state
    
    if (contents.length === 0) return null

    return (
      <>
        {contents.map((content) => {
          switch (content.display_type) {
            case 'horizontal_landscape_large':
              return (
                <Panel1
                  token={token}
                  type={content.type}
                  loadingBar={loadingBar}
                  key={content.id}
                  contentId={content.id}
                  title={content.title}
                  content={content.content}
                  imagePath={imagePath}
                  resolution={resolution}
                  displayType={content.display_type}/>
              )

              case 'horizontal_landscape':
                return (
                  <Panel2
                    token={token}
                    loadingBar={loadingBar}
                    key={content.id}
                    contentId={content.id}
                    title={content.title}
                    content={content.content}
                    imagePath={imagePath}
                    resolution={resolution}
                    displayType={content.display_type}/>
                )

              case 'horizontal':
                return (
                  <Panel3
                    token={token}
                    loadingBar={loadingBar}
                    key={content.id}
                    contentId={content.id}
                    title={content.title}
                    content={content.content}
                    imagePath={imagePath}
                    resolution={resolution}
                    displayType={content.display_type}/>
                )

              case 'vertical':
                return ( 
                  <Panel4
                    token={token}
                    loadingBar={loadingBar}
                    key={content.id}
                    contentId={content.id}
                    title={content.title}
                    content={content.content}
                    imagePath={imagePath}
                    resolution={resolution}
                    displayType={content.display_type}/>
                )
              
              case 'horizontal_square':
                return (
                  <SquareImage
                    token={token}
                    loadingBar={loadingBar}
                    key={content.id}
                    contentId={content.id}
                    title={content.title}
                    content={content.content}
                    imagePath={imagePath}
                    type={content.type}
                    resolution={resolution}
                    displayType={content.display_type}/>
                );
            }
        })}
      </>
    )
  }
}