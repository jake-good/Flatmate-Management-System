import React, { Component } from 'react';
import APIRequest from "../Util/APIRequest";
import PaymentModule from "./PaymentModule";


export default class DashboardPayments extends Component {
    constructor() {
        super();

        this.state = {
            payments: [],
            contributionPayments: []
        };
    }

    async componentDidMount() {
        // Obtain payments associated with the logged in user.
        await APIRequest.obtainUserPayments().then(data => {
            if(!data) data = [];
            data = data.sort((a, b) => a.startDate.localeCompare(b.startDate)).splice(0, Math.min(4, data.length));
            this.setState({
                payments: data
            });
        });

        for (let i = 0; i < this.state.payments.length; i++) {
            await APIRequest.obtainPaymentContributors(
                this.state.payments[i]["id"]
            ).then(usersJSON => {
                if(!usersJSON) usersJSON = [];
                const listUser = [];
                for (let j = 0; j < usersJSON.length; j++) {
                    listUser.push(usersJSON[j]["userName"]);
                }
                this.addUserPayment(listUser);
            });
        }
    }

    addUserPayment = users => {
        let contributionPayments = this.state.contributionPayments;
        contributionPayments.push(users);
        this.setState({
            contributionPayments: contributionPayments
        });
    };

    render () {
        const payments = this.state.payments;
        const paymentComponents = [];
        const contributorsPayments = this.state.contributionPayments;

        for (let i = 0; i < payments.length; i++) {
            const paymentData = payments[i];
            const contributors = contributorsPayments[i];
            paymentComponents.push(
                <PaymentModule
                    payment={paymentData}
                    contributors={contributors}
                    onTableClick={() => { }}
                />
            );
        }

        if(paymentComponents.length === 0) {
            paymentComponents.push(
                <p>You have no upcoming payments.</p>
            );
        }

        return (
            <div>
                <p><b>Upcoming Payments</b></p>
                {paymentComponents}
            </div>
        );
    }
}