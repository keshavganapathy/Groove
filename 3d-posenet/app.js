import React from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';
import { markdown } from 'markdown';
const fs = require("fs");

import styles from './styles.css';

import Joints from './joints';
import GraphicsEngine from './graphics';
import PoseNet from './posenet';

/**
 * React Component for runnign neural networks and 3D graphics
 */
class App extends React.Component {

    /**
     * the class constructor
     * @param {args} props for the parent class
     */
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            webcam: true,
        }
    }

     /**
     * One of React's life cycle methods
     * Once the current React component is loaded, this function
     * initializes neural network model, graphics engine, and webcam.
     */
    async componentDidMount() {
        this.joints = new Joints();
        this.graphics_engine = new GraphicsEngine(this.refs.babylonUser, this.joints);
        this.posenet = new PoseNet(this.joints, this.graphics_engine, this.refs);
        //const descContent = fs.readFileSync("./description.md", "utf-8");
        //this.refs.description.innerHTML = markdown.toHTML(descContent);
        await this.posenet.loadNetwork();
        this.setState({loading: false});
        this.posenet.startPrediction().then((webcam) => {
            this.setState({ webcam });
        });
    }

    /** Asks for webcam access if ti was denied */
    askWebCam(){
        this.posenet.startPrediction();
    }

    /**
     * React Component's render method for rendering HTML components
     */
    render() {
        return (
            <div id="container">
                {/*<h2 className="text-center" id="h2">
                    Controlling Virtual Character Through WebCam
                </h2>
                <h5 id="h5">
                    Note: make sure to give webcam ACCESS and only a single person is in the scene. Otherwise, the results might be inaccurate.
                </h5>
                <div className="row"  id="otherrow">
                    <div className="col-6">
                        <div className="float-right"
                            style={{display:this.state.loading ? 'none' : 'block'}}>
                            <video ref="othervideo" id="othervideo" playsInline/>
                            <canvas ref="otheroutput" width={780} height={780} style={{ display: this.state.webcam ? 'block' : 'none' }}/>
                            {/* <h1>Move Farther</h1> * /}
                            {/*!this.state.webcam && <WeCamAccess/> * /}
                        </div>
                        <div id="otherloader" style={{ display: !this.state.loading ? 'none' : 'block' }}>
                            <h3 id="otherloadTitle">Tensorflow Model loading ...</h3>
                            <ReactLoading type="cylon" color="grey" height={'20%'} width={'20%'} id="otherreactLoader"/>
                        </div>
                    </div>
                    <div className="col-6">
                        <canvas ref="babylonInstructor" width={780} height={780} />
                    </div>
                </div> */}
				<div className="row"  id="row">
                    <div className="col-6">
                        <div className="float-right"
                            style={{display:this.state.loading ? 'none' : 'block'}}>
                            <video ref="video" id="video" playsInline/>
                            <canvas ref="output" id="output" width={780} height={780} style={{ display: this.state.webcam ? 'block' : 'none' }}/>
                        </div>
                        <div id="loader" style={{ display: !this.state.loading ? 'none' : 'block' }}>
                            <h3 id="loadTitle">Tensorflow Model loading ...</h3>
                            <ReactLoading type="cylon" color="grey" height={'20%'} width={'20%'} id="reactLoader"/>
                        </div>
                    </div>
                    <div className="col-6">
                        <canvas id="babylonUser" ref="babylonUser" width={780} height={780} />
                    </div>
                </div>
                {/*<div ref="description" id="description"/>*/}
            </div>
        );
    }
}

const WeCamAccess = () => (
    <div id="webcamaccess">
        <h3>The device does not have a webcam OR webcam access was denied</h3>
        <button onClick={() => window.open("https://support.google.com/chrome/answer/2693767?p=ui_voice_search&visit_id=636795900387801472-2266978072&rd=1", "_blank")}>
            Grant Webcam Access
        </button>
    </div>);

ReactDOM.render(
    <App />,
    document.getElementById('react-container')
);

