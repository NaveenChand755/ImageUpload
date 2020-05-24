import React, { Component } from 'react';
import ImageUpload from './ImageUpload'

class ImageUploadPage extends Component {
  render() {
    return (
      <div className="container">
        <b>PREVIEW</b>
                <ImageUpload />
        </div>
    );
  }
}

export default ImageUploadPage;