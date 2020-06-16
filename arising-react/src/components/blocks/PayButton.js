import React, { Component } from 'react'
import { /** Checkbox*/ Button } from 'semantic-ui-react'
import ecc from 'arisenjs-ecc'
import MasterConfig from '../../config/Master'
import Swal from 'sweetalert2'
class PayButton extends Component {

    state = {
        isLoading: false,
        wantsExtra: false
    }

    wantsExtra = () => {
        let { wantsExtra } = this.state
        this.setState({wantsExtra: !wantsExtra})
    }

    getName = () => {
        // add a plus to the order name (if extra stake is wanted).
        let { wantsExtra } = this.state
        let { name } = this.props
        return wantsExtra ? `${name}+` : name
    }

    getPrice = () => {
        let { wantsExtra } = this.state
        let { accountPrice, extraPrice } = this.props
        return wantsExtra ? accountPrice+extraPrice : accountPrice
    }

    getCheckout = () => {
        let { ownerPublic, activePublic } = this.props
        let name = this.getName()
        // set loading status.
        this.setState({isLoading:true})
        // get checkout.
        fetch(`${MasterConfig.httpEndpoint}/newuser/${name}/${ownerPublic}/${activePublic}`)
        .then(response => response.json())
        .then((checkout) => {
            
          // save last checkout object
        //   window.checkout=checkout
          // open checkout
        //   window.open(checkout.redirect)
          // hide current modal
        //   this.props.closeBuyModal()
          // show success modal
          Swal.fire('Your PeepsID has been registered.', 'You officially have the only account you will ever need for the decentralized web. How does it feel to have an account that cannot be hacked? Welcome to the dWeb and thanks for joining the Peeps revolution.', 'success')
            .then(res => {
                if(res) {
                    //  window.location.href='https://github.com/arisenio/avote/releases'
                    Swal.fire({
                        title:'Start Using The dWeb', // eslint-disable-next-line 
                        html: 'You can use the dWallet  to interact with the Arisen network.'+' '+'<a href="https://arisen.network/dwallet" target="_blank">Click here to download.</a>',
                        confirmButtonText: `Show Me Around`
                    })
                    .then(() => window.location = "https://dsearch.network")
                    .catch(e => console.log("Start USING", e))
                }
            })
            .catch(e => console.log("START USING", e))
        //   window.location.href="https://github.com/arisenio/avote/releases"
          this.props.showSuccessModal()
        });
    }

    render() {
        let { ownerPublic, activePublic, /** extraPrice*/ } = this.props
        // let { wantsExtra } = this.state

        // to submit, the `ownerPublic` key MUST be present AND valid.
        // an `activePublic` key is optional, but if present MUST be valid.
        let canSubmit = ecc.isValidPublic(ownerPublic)
            && (!activePublic.length || ecc.isValidPublic(activePublic))

        return (
        <div align={'center'}>
            {/**!canSubmit ? <div>A <u>valid</u> RSN public key is required.</div> :
            <div><Checkbox onClick={this.wantsExtra} defaultChecked={wantsExtra}
            label={`Get 0.12 RSN (6x more) for just $${extraPrice} extra.`} /></div> */}
            <div className="spacer" />
            <Button
                positive
                fluid
                // icon='cart'
                content={`Register Account`}
                disabled={!canSubmit}
                loading={this.state.isLoading}
                onClick={this.getCheckout}
                
            />
            <div className="spacer" />
        </div>
        )
    }
    
    
}


export default PayButton
