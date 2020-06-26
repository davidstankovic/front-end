import React from 'react';
import api, { ApiResponse, saveToken, saveRefreshToken } from '../../api/api';
import { Redirect } from 'react-router-dom';

export default class AdministratorLogoutPage extends React.Component{
    constructor(props: Readonly<{}>) {
        super(props);
    }


    render() {
        localStorage.removeItem('http://localhost:4000')
        return (
            <div></div>
        );


}}