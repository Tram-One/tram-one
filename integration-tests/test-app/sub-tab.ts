import { registerHtml, useEffect, useGlobalStore, useStore } from '../../src/tram-one';

const html = registerHtml();

type TabState = {
	tabWasUpdated: boolean;
	tabWasDismissed: boolean;
	shouldDisplayTab: boolean;
	isTabLocked: boolean;
	loading: boolean;
};

/**
 * Component for testing effects and global state
 * It can be removed by clicking "Dismiss".
 * Its effects can be refreshed (cleaned up) by clicking "Lock Tab"
 */
module.exports = () => {
	// global state that controls if the tab is shown and what it shows
	const tabState = useGlobalStore('tab-state') as TabState;

	// local tab state for testing local effect changes
	const previousLockState = useStore({ locked: false });

	// cleanup function that indicates that the effect was cleaned up (by state update)
	const onTabUpdated = () => {
		tabState.tabWasUpdated = true;
	};

	// effect to verify that non-function cleanups are ignored
	useEffect(() => {
		return 5;
	});

	// effect to test state triggers on effects
	useEffect(() => {
		if (!tabState.shouldDisplayTab) {
			tabState.tabWasDismissed = true;
		}
	});

	// effect to test cleanups on state change
	useEffect(() => {
		if (tabState.isTabLocked) {
			/* trigger effect update */
		}

		return onTabUpdated;
	});

	// effect to test updated cleanups on state change
	const setPreviousLockState = (prevState: boolean) => () => {
		previousLockState.locked = prevState;
	};

	useEffect(() => {
		return setPreviousLockState(tabState.isTabLocked);
	});

	// trigger parent component to remove this one
	const onDismiss = () => {
		tabState.shouldDisplayTab = false;
	};

	// trigger effect cleanup
	const onLockTab = () => {
		tabState.isTabLocked = true;
	};

	// change lock state (for updated cleanup effects)
	const onUnlockTab = () => {
		tabState.isTabLocked = false;
	};

	return html`
		<section class="sub-tab">
			<span>Loading: ${tabState.loading}</span><br />
			<span>Updated: ${tabState.tabWasUpdated}</span><br />
			<span>Was Locked: ${previousLockState.locked}</span><br />
			<button role="lock-button" onclick=${onLockTab}>Lock Tab</button>
			<button role="unlock-button" onclick=${onUnlockTab}>Unlock Tab</button>
			<button role="dismiss-button" onclick=${onDismiss}>Dismiss</button>
		</section>
	`;
};
