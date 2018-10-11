/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import UserPage from '../Page/UserPage';
import AdminPage from '../Page/AdminPage';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = { page: 'index.js', description: 'User layout' };
    }

    render() {
        return (
            <div>
                <div>
                    <UserPage txId={this.props.match.params.txId} />
                </div>
            </div>
        );
    }
}

export default User;

