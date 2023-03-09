import env from './env';
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

import { history } from './_helpers';

const baseUrl = `${env.REACT_APP_API_URL}/accounts`;
const accountSubject = new BehaviorSubject(null);
const accountsKey = 'react-facebook-login-accounts';
let accounts = JSON.parse(localStorage.getItem(accountsKey)) || [];
export const accountService = {
    login, 
    logout,
    getById,
    update,
    delete: _delete,
    account: accountSubject.asObservable(),
    get accountValue() { return accountSubject.value; }
};

async function login() {
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise(window.FB.login);
    if (!authResponse) return;


    axios.get(`https://graph.facebook.com/v8.0/me?access_token=${authResponse.accessToken}`)
        .then(response => {
            const { data } = response;
            let account = accounts.find(x => x.facebookId === data.id);
            if (!account) {
                // create new account if first time logging in
                account = {
                    id: newAccountId(),
                    facebookId: data.id,
                    name: data.name,
                    extraInfo: `This is some extra info about ${data.name} that is saved in the API`
                }
                accounts.push(account);
                localStorage.setItem(accountsKey, JSON.stringify(accounts));
            }
            console.log(account);
            return account
        });

 
}


function logout() {
    // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
    window.FB.api('/me/permissions', 'delete', null, () => window.FB.logout());
    stopAuthenticateTimer();
    accountSubject.next(null);
    history.push('/login');
}

function newAccountId() {
    return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
}
function generateJwtToken(account) {
    // create token that expires in 15 minutes
    const tokenPayload = {
        exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000),
        id: account.id
    }
    return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
}

function ok(body) {
    // wrap in timeout to simulate server api call

}
function unauthorized() {
    setTimeout(() => {
        const response = { status: 401, data: { message: 'Unauthorized' } };
        // manually trigger error interceptor
        const errorInterceptor = axios.interceptors.response.handlers[0].rejected;
        errorInterceptor({ response });
    }, 500);
}

function getById(id) {
    return axios.get(`${baseUrl}/${id}`)
        .then(response => response.data);
}

async function update(id, params) {
    const response = await axios.put(`${baseUrl}/${id}`, params);
    let account = response.data;
    // update the current account if it was updated
    if (account.id === accountSubject.value?.id) {
        // publish updated account to subscribers
        account = { ...accountSubject.value, ...account };
        accountSubject.next(account);
    }
    return account;
}

async function _delete(id) {
    await axios.delete(`${baseUrl}/${id}`);
    if (id === accountSubject.value?.id) {
        // auto logout if the logged in account was deleted
        logout();
    }
}

// helper methods

let authenticateTimeout;

function startAuthenticateTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(accountSubject.value.token.split('.')[1]));

    // set a timeout to re-authenticate with the api one minute before the token expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    const { accessToken } = window.FB.getAuthResponse(); 
}

function stopAuthenticateTimer() {
    // cancel timer for re-authenticating with the api
    clearTimeout(authenticateTimeout);
}