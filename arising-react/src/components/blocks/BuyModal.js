import React, { Component } from 'react'
import { Button, Input, Icon, Modal, Divider } from 'semantic-ui-react'
import ecc from 'arisenjs-ecc'
import PayButton from './PayButton'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import 'font-awesome/css/font-awesome.min.css';
import { PrivateKey, /**PublicKey */ } from '@arisencore/ecc';
const ethers =  require('ethers');

class BuyModal extends Component {

    state = {
        open: false,
        ownerPrivate: '',   // owner prv/pub key pair
        ownerPublic: '',
        ownerLoading: false,
        activePrivate: '',  // active prv/pub key pair
        activePublic: '',
        mnemonic: [],
        activeLoading: false,
        showActivePair: false, // show the active keypair
        copied: false, // Copy the key pairs,
        passPhraseCopied: false
    }
    componentDidMount() {
        this.memKey();
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

    passPhrase = (text) => {

        if(text) {
            this.setState({passPhraseCopied: text})
            setTimeout(() => {
                this.setState({passPhraseCopied: false})
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
    memKey = () => {
        let wallet = ethers.Wallet.createRandom();
        let Mnemonic_List = wallet.mnemonic

        // this.setState({
        //     mnemonic: Mnemonic_List.split(" ")
        // })

        this.setState({
            mnemonic: Mnemonic_List.split(" "),
            mnemonic_list: Mnemonic_List
        },()=>{ 
             this.genKeyPair('owner');
             this.genKeyPair('active');
           })

         //this.genKeyPair('owner');
         //this.genKeyPair('active');
    }
    genKeyPair = (genType='owner') => {
        // generates a public private key pair.
        // set loading.
        this.setState({[`${genType}Loading`]:true})
        let master = PrivateKey.fromSeed(this.state.mnemonic_list)
        let ownerPrivate = master.getChildKey('owner')
        let activePrivate = ownerPrivate.getChildKey('active')
        // console.log(ownerPrivate.toString()," ",PrivateKey.fromString(ownerPrivate.toWif()).toPublic().toString()," ",activePrivate.toString() , PrivateKey.fromString(activePrivate.toWif()).toPublic().toString())

        // ecc.randomKey().then(privateKey => {
        //     let publicKey = ecc.privateToPublic(privateKey)
            if(genType==='owner') {
                // save for owner
                this.setState({
                    ownerPrivate: ownerPrivate,
                    ownerPublic: PrivateKey.fromString(ownerPrivate.toWif()).toPublic().toString(),
                    ownerLoading: false
                })
            } else {
                // save for active
                this.setState({
                    activePrivate: activePrivate,
                    activePublic: PrivateKey.fromString(activePrivate.toWif()).toPublic().toString(),
                    activeLoading: false
                })
            }
        // })
    }

    renderKeyInputs = (isOwnerRender) => {

        // generate inputs for active or owner keys.
        let genType = isOwnerRender ? 'owner' : 'active'
        let pubKey = isOwnerRender ? this.state.ownerPublic : this.state.activePublic
        let privKey = isOwnerRender ? this.state.ownerPrivate : this.state.activePrivate

        return (
        <div>
            {genType === 'owner' && <h3>Your 12 word backup phrase is: {" "}
            <CopyToClipboard
                    text={this.state.mnemonic}
                    onCopy={(text,result) => {
                        this.passPhrase(text)
                    }}
                    >
                    <span><i className="fa fa-copy"></i></span>
                </CopyToClipboard><br></br>
                {this.state.passPhraseCopied ? <span style={{color: 'red', fontSize: 14, marginLeft: 10}}>Pass Phrase Keys Copied</span> : null}
                </h3>}{genType === 'owner' && 
                <div className="random-mnemonic">
                    <span>1. {"  "+this.state.mnemonic[0]}</span>
                    <span>2. {"  "+this.state.mnemonic[1]}</span>
                    <span>3. {"  "+this.state.mnemonic[2]}</span>
                    <span>4. {"  "+this.state.mnemonic[3]}</span>
                    <span>5. {"  "+this.state.mnemonic[4]}</span>
                    <span>6. {"  "+this.state.mnemonic[5]}</span>
                    <span>7. {"  "+this.state.mnemonic[6]}</span>
                    <span>8. {"  "+this.state.mnemonic[7]}</span>
                    <span>9. {"  "+this.state.mnemonic[8]}</span>
                    <span>10. {"  "+this.state.mnemonic[9]}</span>
                    <span>11. {"  "+this.state.mnemonic[10]}</span>
                    <span>12. {"  "+this.state.mnemonic[11]}</span>
                </div>
            }
            { this.state.showActivePair &&
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
            }
            <div className="spacer" />
            {
                this.state.showActivePair &&
            <Input
                placeholder='RSN8mUGcoTi12WMLtTfYFGBSFCtHUSVq15h3XUoMhiAXyRPtTgZjb'
                onChange={(e) => this.onKeyChange(e,genType)}
                value={pubKey}
                // onChange={({target: {value}}) => this.setState({value, copied: false})}
                fluid
                error={Boolean(pubKey.length) && !ecc.isValidPublic(pubKey) } // highlight if not empty and invalid
            />
            }
                {
                    this.state.showActivePair && 
                <Input
                    value={privKey}
                    onChange={({target: {value}}) => this.setState({value, copied: false})}
                    size='mini'
                    label={{ icon: 'key', color: 'green' }}
                    labelPosition='right corner'
                    fluid
                    disabled
                />
                }
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
                        This is your backup phrase that can be used to securely import your PeepsID on any device. Please write this phrase down and keep it in a safe place.
                    </p>
                    <Divider />
                    {this.renderKeyInputs(true)}
                    <br />
                    {this.state.showActivePair ? this.renderKeyInputs(false) :
                     <Button size='mini' onClick={this.showActive}>+ Show Me The Keys</Button> /** this.renderKeyInputs(false) */}

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
