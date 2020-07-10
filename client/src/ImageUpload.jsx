import React, { Component } from "react";
import { API_URL } from "./config";
import Notifications  from 'react-notify-toast'
import Spinner from './Spinner'
import Images from './Images'

export default class Uploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFileHeight: "",
      selectedFileWidth: "",
      file1: null,
      file2: null,
      file3: null,
      file4: null,
      imagePreviewUrl1: "",
      imagePreviewUrl2: "",
      imagePreviewUrl3: "",
      imagePreviewUrl4: "",
      uploading: false,
      images: []
    };
    this.uploadSingleFile = this.uploadSingleFile.bind(this);
    this.upload = this.upload.bind(this);
  }

  fileUrl;
  crop1;
  crop2;
  crop3;
  crop4;

  uploadSingleFile(event) {
    if (event.target['files'] && event.target['files'][0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target['files'][0]); // read file as data url
      reader.onload = (event) => {
        this.fileUrl = event.target['result'];
        let imgObject = new Image();
        imgObject.src = this.fileUrl;
        imgObject.onload = () => {
          this.setState({
            selectedFileHeight: imgObject.height,
            selectedFileWidth: imgObject.width
          })
          this.bufferCanvas(imgObject);
        }
      }
    }
  }

  bufferCanvas(image) {
    let bufferCanvas = document.createElement('canvas');
    let bufferContext = bufferCanvas.getContext('2d');
    bufferCanvas.width = image.width;
    bufferCanvas.height = image.height;
    bufferContext.drawImage(image, 0, 0);
    this.cr1(bufferCanvas);
    this.cr2(bufferCanvas);
    this.cr3(bufferCanvas);
    this.cr4(bufferCanvas);
  }

  cr1(bufferCanvas) {
    let tnCanvas = document.createElement('canvas');
    let tnCanvasContext = tnCanvas.getContext('2d');
    tnCanvas.width = 755; tnCanvas.height = 450;
    tnCanvasContext.drawImage(bufferCanvas, 0, 0, 755, 450, 0, 0, 755, 450);
    this.crop1 = tnCanvas.toDataURL();
    let blobBin = atob(this.crop1.split(",")[1]);
    let array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    let newFile = new Blob([new Uint8Array(array)], { type: "image/png" });
    this.setState({ imagePreviewUrl1: this.crop1, file1: newFile })
  }

  cr2(bufferCanvas) {
    let tnCanvas = document.createElement('canvas');
    let tnCanvasContext = tnCanvas.getContext('2d');
    tnCanvas.width = 365; tnCanvas.height = 450;
    tnCanvasContext.drawImage(bufferCanvas, 0, 0, 365, 450, 0, 0, 365, 450);
    this.crop2 = tnCanvas.toDataURL();
    let blobBin = atob(this.crop2.split(",")[1]);
    let array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    let newFile = new Blob([new Uint8Array(array)], { type: "image/png" });
    this.setState({ imagePreviewUrl2: this.crop2, file2: newFile })
  }

  cr3(bufferCanvas) {
    let tnCanvas = document.createElement('canvas');
    let tnCanvasContext = tnCanvas.getContext('2d');
    tnCanvas.width = 365; tnCanvas.height = 212;
    tnCanvasContext.drawImage(bufferCanvas, 0, 0, 365, 212, 0, 0, 365, 212);
    this.crop3 = tnCanvas.toDataURL();
    let blobBin = atob(this.crop3.split(",")[1]);
    let array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    let newFile = new Blob([new Uint8Array(array)], { type: "image/png" });
    this.setState({ imagePreviewUrl3: this.crop3, file3: newFile })
  }

  cr4(bufferCanvas) {
    let tnCanvas = document.createElement('canvas');
    let tnCanvasContext = tnCanvas.getContext('2d');
    tnCanvas.width = 380; tnCanvas.height = 380;
    tnCanvasContext.drawImage(bufferCanvas, 0, 0, 380, 380, 0, 0, 380, 380);
    this.crop4 = tnCanvas.toDataURL();
    let blobBin = atob(this.crop4.split(",")[1]);
    let array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    let newFile = new Blob([new Uint8Array(array)], { type: "image/png" });
    this.setState({ imagePreviewUrl4: this.crop4, file4: newFile })
  }


  upload(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myfile1", this.state.file1, this.state.file1.name);
    formData.append("myfile2", this.state.file2, this.state.file2.name);
    formData.append("myfile3", this.state.file3, this.state.file3.name);
    formData.append("myfile4", this.state.file4, this.state.file4.name);
    if (this.state.selectedFileHeight > 1024 && this.state.selectedFileWidth > 1024) {
      alert("Please select a file of dimensions '1024 x 1024' or less")
      return <fetch className="abort"></fetch>
    }
    this.setState({ uploading: true })
    fetch(`${API_URL}/image-upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((images) => {
        this.setState({
          uploading: false,
          images,
          imagePreviewUrl1: "",
          imagePreviewUrl2: "",
          imagePreviewUrl3: "",
          imagePreviewUrl4: "",
        });
        alert("Uploaded")
      })
      .catch((err) => {
        err.json().then((e) => {
          alert("Failed to upload")
          this.setState({ uploading: false });
        });
      });
  }



  filter = id => {
    return this.state.images.filter(image => image.public_id !== id)
  }

  removeImage = id => {
    this.setState({ images: this.filter(id) })
  }

  onError = id => {
    alert('Oops, something went wrong')
    this.setState({ images: this.filter(id) })
  }

  render() {
    const { uploading, images } = this.state
    let imgPreview1;
    if (this.state.imagePreviewUrl1) {
      imgPreview1 = <img src={this.state.imagePreviewUrl1} alt="" />;
    }
    let imgPreview2;
    if (this.state.imagePreviewUrl2) {
      imgPreview2 = <img src={this.state.imagePreviewUrl2} alt="" />;
    }
    let imgPreview3;
    if (this.state.imagePreviewUrl3) {
      imgPreview3 = <img src={this.state.imagePreviewUrl3} alt="" />;
    }
    let imgPreview4;
    if (this.state.imagePreviewUrl4) {
      imgPreview4 = <img src={this.state.imagePreviewUrl4} alt="" />;
    }
    const content = () => {
      switch (true) {
        case uploading:
          return <Spinner />
        case images.length > 0:
          return <Images
            images={images}
            removeImage={this.removeImage}
            onError={this.onError}
          />
        default:
          return <div className="form-group preview">
            Horizontal: {imgPreview1}  Vertical : {imgPreview2} Horizontal small: {imgPreview3} Gallery: {imgPreview4}
            <input
              id="file"
              type="file"
              className="form-control"
              onChange={this.uploadSingleFile}
            /><br></br>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={this.upload}
            >
              Upload
            </button>
          </div>
      }
    }
    return (
      <div className='container'>
        <Notifications />
        <div className='buttons'>
          {content()}
        </div>
      </div>
    )
  }
}








