import config from "../config.json";
import {getAdmin, delay} from "./utils";

import React from "react";
import CarPanel from "./CarPanel";
import TollPanel from "./TollPanel";
import OfficerPanel from "./OfficerPanel";
import MapPanel from "./MapPanel";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      loading: true, // as fetching admin first
      hint: `Please ensure you're using a web3.js wallet such as <a href="https://metamask.io" target="_blank">Metamask</a>.  Please ensure you're using the <a href="https://rinkeby.etherscan.io" target="_blank">Rinkeby testnet</a> with your web3.js wallet.`,
      footnote: `<p>For <em>DOLLARS</em> our make-believe "city" has previously <a href="https://test.ledger.overhide.io" target="_blank">registered</a> with the <a href="https://test.ledger.overhide.io" target="_blank">overhide-ledger test network</a> using their <code>0xd6106c445A07a6A1caF02FC8050F1FDe30d7cE8b</code> ledger address.</p><hr/><p>For <em>ETHERS</em> our make-believe "city" uses the same <code>0xd6106c445A07a6A1caF02FC8050F1FDe30d7cE8b</code> <em>ledger address</em> with the <a href="https://rinkeby.etherscan.io/address/0xd6106c445A07a6A1caF02FC8050F1FDe30d7cE8b" target="_blank">Rinkeby testnet</a>.</p>`,
      atCar: false,
      carAddress: null,
      plateHash: null,
      carCoordsX: null,
      carCoordsY: null,
      carCoordsZone: null,
      enforcementCoordsX: null,
      enforcementCoordsY: null,
      hunterCoordsX: null,
      hunterCoordsY: null,
      hunterCoordsZone: null,
      visaHintOpacity: null
    };
    this.fetchAdmin();
  }

  // fetch admin from Azure
  fetchAdmin = async () => {
    try {
      await getAdmin()
      this.setState({ loading: false })
    }
    catch(error) {
      this.setState({ error: error, loading: false });
    } 
  }

  // Is there an error?
  //
  // @param {string} value - error value or null
  setError = (value) => {
    console.log('display error :: ' + value);
    this.setState({ error: value });
  };

  // Take hint text from *config.json* and display as modal
  //
  // @param {string} which - hint key
  doHint = (which) => {
    if (which) {
      console.log('displaying hint :: ' + config.hints[which]);
      this.setState({hint: config.hints[which]});
    } else {
      console.log('clearing hint');
      this.setState({ hint: null });
    }
  }

  shouldVisaHintShow = async (yes) => {
    if (yes) {
      this.setState({ visaHintOpacity: "0"});
      await delay(0);
      this.setState({ visaHintOpacity: "1" });
    } else {
      this.setState({ visaHintOpacity: null });
    }
  }

  setCarAddress = (address, plateHash) => {
    this.setState({carAddress: address, plateHash: plateHash});
  };

  setAtCar = (flag) => {
    this.setState({atCar: flag});
  }

  setCarCoords = (x, y, zone) => {
    this.setState({ carCoordsX: x, carCoordsY: y, carCoordsZone: zone });
  }

  setEnforcementCoords = (x, y) => {
    this.setState({ enforcementCoordsX: x, enforcementCoordsY: y });
  }

  setHunterCoords = (x, y, zone) => {
    this.setState({ hunterCoordsX: x, hunterCoordsY: y, hunterCoordsZone: zone });
  }

  render() {
    // report errors
    if (this.state.error) {
      var error = (
        <div className="ui icon red message">
          <i className="exclamation circle icon"></i>
          <i aria-hidden="true" className="close icon" onClick={(event) => this.setState({ error: null })}></i>
          <div className="content"><p>{this.state.error}</p></div>
        </div>
      );
    }
    // show hints
    if (this.state.hint) {
      var hint = (
        <div className="ui icon blue message">
          <i aria-hidden="true" className="close icon" onClick={(event) => this.setState({ hint: null })}></i>
          <div className="content">
            <div style={{display: "flex", justifyContent: "flex-start"}}>
              <i className="info circle large icon" style={{paddingRight:"1.5em"}}></i>
              <span dangerouslySetInnerHTML={{ __html: this.state.hint }}></span>
            </div>
          </div>
        </div>
      );
    }
    // show footnote
    if (this.state.footnote) {
      var footnote = (
        <div className="ui positive message" style={{marginTop: "30px", marginBottom: "30px", width: "80%"}}>
          <i aria-hidden="true" className="close icon" onClick={(event) => this.setState({ footnote: null })}></i>
          <div className="content">
            <div className="header" style={{textAlign: "center"}}>Background Info</div>
            <p dangerouslySetInnerHTML={{ __html: this.state.footnote }}></p>
          </div>
        </div>
      );
    }
    // show VISA help
    if (this.state.visaHintOpacity) {
      var visaHint = (
        <img src="assets/visa.png" style={{ position: "absolute", top: "10px", right: "0px", zIndex: "200", opacity: this.state.visaHintOpacity, transition: "opacity 1s ease-in 4s"}}></img>
      );
    }
    // main UI
    return (
      <div>

        <div style={{ position: "absolute", display: "flex", flexDirection: "column", fontSize: "large", fontFamily: "cursive", marginLeft:"10px", zIndex: "1" }}>
          <a href="https://github.com/overhide/ledgers.js-demo-serverless-dapp" target="_blank" style={{ display: "flex", alignItems: "center" }}>
            <img src="assets/icons8-github-96.png" style={{ width: "48px" }}></img><span style={{ marginLeft: "10px" }}>README</span>
          </a>
          <a href="https://youtu.be/oLJsU3aSCP4" target="_blank" style={{ display: "flex", alignItems: "center" }}>
            <img src="assets/icons8-play-button-96.png" style={{ width: "48px" }}></img><span style={{ marginLeft: "10px" }}>WATCH</span>
          </a>
        </div>

        <div className="ui center aligned grid" style={{marginTop:"20px", maxWidth: "1700px", marginRight: "auto", marginLeft: "auto"}}>
          {/* dimmer for whole page */}
          <div className={`ui ${this.state.loading ? "active" : ""} dimmer`}>
            <div className="ui loader"></div>
          </div>
          {/* VISA hint */}
          {visaHint}
          <div style={{position: "absolute", top: "5px", left: "10%", width: "80%", zIndex: "110", opacity: "0.80"}}>
            {/* error banner for whole page */}
            {error}
            {/* hint banner */}
            {hint}
            {/* payment component */}
          </div>

          <div className="ui grid">
            <div className="row" style={{height: "50px"}}>
            </div>
            <div className="three column row">

              <div className="column" style={{minWidth: "550px", maxWidth: "550px", marginBottom: "20px", marginTop: "65px"}}>
                <div style={{ minWidth: "420px", maxWidth: "420px", margin: "auto" }}>
                  <CarPanel
                    setError={this.setError}
                    doHint={this.doHint}
                    shouldVisaHintShow={this.shouldVisaHintShow}
                    carAddressSetterFn={this.setCarAddress} />
                </div>
              </div>
              <div className="column" style={{minWidth: "462px", maxWidth: "462px", minHeight: "528px", marginBottom: "20px", marginLeft: "10px", marginRight: "10px", padding: "0px"}}>
                <MapPanel
                  setError={this.setError}
                  doHint={this.doHint}
                  atCarSetterFn={this.setAtCar}
                  carCoordsSetterFn={this.setCarCoords}
                  enforcementCoordsX={this.state.enforcementCoordsX}
                  enforcementCoordsY={this.state.enforcementCoordsY}
                  hunterCoordsSetterFn={this.setHunterCoords} />
              </div>
              <div className="column" style={{ minWidth: "550px", maxWidth: "550px", marginTop: "65px"}}>
                <div style={{ minWidth: "420px", maxWidth: "420px", margin: "auto" }}>
                  <TollPanel
                    setError={this.setError}
                    doHint={this.doHint}
                    atCar={this.state.atCar}
                    carAddress={this.state.carAddress}
                    plateHash={this.state.plateHash}
                    hunterCoordsX={this.state.hunterCoordsX}
                    hunterCoordsY={this.state.hunterCoordsY}
                    hunterCoordsZone={this.state.hunterCoordsZone}/>
                </div>
                <div style={{ minWidth: "420px", maxWidth: "420px", margin: "auto", marginTop: "105px" }}>
                  <OfficerPanel
                    setError={this.setError}
                    doHint={this.doHint}
                    carAddress={this.state.carAddress}
                    carCoordsX={this.state.carCoordsX}
                    carCoordsY={this.state.carCoordsY}
                    carCoordsZone={this.state.carCoordsZone}
                    enforcementCoordsSetterFn={this.setEnforcementCoords} />
                </div>
              </div>
            </div>
          </div>
          {/* footnote banner */}
          {footnote}
        </div>
      </div>
    );
  }
}

export default App;