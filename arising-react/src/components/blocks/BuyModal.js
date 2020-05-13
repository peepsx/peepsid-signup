import React, { Component } from 'react'
import { Button, Input, Icon, Modal, Divider } from 'semantic-ui-react'
import ecc from 'arisenjs-ecc'
import PayButton from './PayButton'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import 'font-awesome/css/font-awesome.min.css';

class BuyModal extends Component {

    state = {
        open: false,
        ownerPrivate: '',   // owner prv/pub key pair
        ownerPublic: '',
        ownerLoading: false,
        activePrivate: '',  // active prv/pub key pair
        activePublic: '',
        activeLoading: false,
        showActivePair: false, // show the active keypair
        copied: false // Copy the key pairs
    }
    componentDidMount() {
        this.genKeyPair('owner');
        this.genKeyPair('avtive');

    }
    open = () => { this.setState({open: true})}
    close = () => { this.setState({open: false})}
    showActive = () => { this.setState({showActivePair:true}) }
    
    textCopy = (text) => {

        if(text) {
            this.setState({copied: text})
            setTimeout(() => {
                this.setState({copied: false})
            }, 2000)
        }
    }


    onKeyChange = (e,genType) => {
        // capture typing of public key.
        this.setState({[`${genType}Private`]: '', [`${genType}Public`]: e.target.value})
    }

    onKeyReset = (genType) => {
        this.setState({[`${genType}Private`]: '', [`${genType}Public`]: ''})
    }

    genKeyPair = (genType='owner') => {
        // generates a public private key pair.
        // set loading.
        this.setState({[`${genType}Loading`]:true})

        ecc.randomKey().then(privateKey => {
            let publicKey = ecc.privateToPublic(privateKey)
            if(genType==='owner') {
                // save for owner
                this.setState({
                    ownerPrivate: privateKey,
                    ownerPublic: publicKey,
                    ownerLoading: false
                })
            } else {
                // save for active
                this.setState({
                    activePrivate: privateKey,
                    activePublic: publicKey,
                    activeLoading: false
                })
            }

        })
    }

    renderKeyInputs = (isOwnerRender) => {

        // generate inputs for active or owner keys.
        let genType = isOwnerRender ? 'owner' : 'active'
        let pubKey = isOwnerRender ? this.state.ownerPublic : this.state.activePublic
        let privKey = isOwnerRender ? this.state.ownerPrivate : this.state.activePrivate

        return (
        <div>
            <h3>
                {genType} public key &nbsp;
                {/* <Button size='mini' onClick={() => {this.genKeyPair(genType)}}
                    loading={this.state[`${genType}Loading`]}>need one?</Button> */}
                {/**pubKey ? <Button size='mini' icon='cancel' onClick={() => {this.onKeyReset(genType)}} /> : null */ }
                <CopyToClipboard
                    text={"PUBLIC_KEY - " + pubKey + " , PRIVATE_KEY - " + privKey}
                    onCopy={(text,result) => {
                        this.textCopy(text)
                    }}
                    >
                    <span><i className="fa fa-copy"></i></span>
                </CopyToClipboard>
                {"PUBLIC_KEY - " + pubKey + " , PRIVATE_KEY - " + privKey === this.state.copied ? <span style={{color: 'red', fontSize: 14, marginLeft: 10}}>Public & Private Key Copied</span> : null}
            </h3>
            <div className="spacer" />
            <Input
                placeholder='RSN8mUGcoTi12WMLtTfYFGBSFCtHUSVq15h3XUoMhiAXyRPtTgZjb'
                onChange={(e) => this.onKeyChange(e,genType)}
                value={pubKey}
                // onChange={({target: {value}}) => this.setState({value, copied: false})}
                fluid
                error={Boolean(pubKey.length) && !ecc.isValidPublic(pubKey) } // highlight if not empty and invalid
            />
            {privKey ?
                <Input
                    value={privKey}
                    onChange={({target: {value}}) => this.setState({value, copied: false})}
                    size='mini'
                    label={{ icon: 'key', color: 'green' }}
                    labelPosition='right corner'
                    fluid
                    disabled
                /> : null}
        </div>
        )
    }

    render() {
        let { searchResponse, accountPrice, extraPrice } = this.props

        return (
        <div>
            <Button
                positive
                fluid
                size='big'
                icon='checkmark'
                labelPosition='right'
                onClick={this.open}
                content= 'Proceed'
            />
            <Modal closeIcon size='tiny' dimmer='blurring' open={this.state.open} onClose={this.close}>
                <Modal.Content>

                    <h1><Icon name='user circle' /> {searchResponse.account}</h1>
                    <p>
                        Let's get your ARISEN name registered.
                        Make sure your <i>private key <Icon name='key' /> is saved</i> before continuing.
                    </p>
                    <Divider />
                    {this.renderKeyInputs(true)}
                    <br />
                    {this.state.showActivePair ? this.renderKeyInputs(false) :
                    /** <Button size='mini' onClick={this.showActive}>+ active public key (optional)</Button> */ this.renderKeyInputs(false)}

                </Modal.Content>
                <Modal.Actions>
                    <PayButton
                        accountPrice={accountPrice}
                        extraPrice={extraPrice}
                        ownerPublic={this.state.ownerPublic}
                        activePublic={this.state.activePublic}
                        name={searchResponse.account}
                        closeBuyModal={this.close}
                        showSuccessModal={this.props.showSuccessModal}
                    />
                </Modal.Actions>
            </Modal>
        </div>
        )
    }


}


export default BuyModal
