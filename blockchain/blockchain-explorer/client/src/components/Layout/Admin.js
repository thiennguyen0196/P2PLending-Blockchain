/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import AdminPage from '../Page/AdminPage';

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = { page: 'index.js', description: 'Admin layout' };
    }

    render() {
        return (
            <div>
                <div>
                    <AdminPage />
                </div>
            </div>
        );
    }
}

export default Admin;

