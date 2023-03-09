import React from "react";

class ImageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageStatus: "loading", error: false };
  }

  handleImageLoaded() {
    this.setState({ imageStatus: "loaded", error: false });
  }

  handleImageError() {
    this.setState({ imageStatus: "failed to load", error: true });
  }

  render() {
    return (
      <div>
        <img className={this.props.className}
          src={this.state.error ?  "/assets/homepage/c1.png" : this.props.src}
          onLoad={this.handleImageLoaded.bind(this)}
        />
      </div>
    );
  }
}
export default ImageComponent;