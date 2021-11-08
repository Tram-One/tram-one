import { registerHtml, useUrlParams, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * component to test url parameters
 */
const account: TramOneComponent = () => {
	const { account, loggedIn = 'No' } = useUrlParams('/:account');
	return html`
		<div>
			<p class="account">Account: ${account ? account : 'No Account Info'}</p>
			<p class="account">Is Account Logged In: ${loggedIn}</p>
		</div>
	`;
};

export default account;
