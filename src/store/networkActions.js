import { rpc } from '../lib/rpc';
import { start } from 'store/store'

let watchingHeight = false;

export function loadHeight(watch) {
    return (dispatch) =>
        rpc.call('eth_blockNumber', []).then((result) => {
            dispatch({
                type: 'NETWORK/BLOCK',
                height: result,
            });
            if (watch && !watchingHeight) {
                watchingHeight = true;
                setTimeout(() => dispatch(loadHeight(true)), 5000);
            }
        });
}

export function loadSyncing() {
    return (dispatch) =>
        rpc.call('eth_syncing', []).then((result) => {
            if (typeof result === 'object') {
                dispatch({
                    type: 'NETWORK/SYNCING',
                    syncing: true,
                    status: result,
                });
                setTimeout(() => dispatch(loadSyncing()), 1000);
            } else {
                dispatch({
                    type: 'NETWORK/SYNCING',
                    syncing: false,
                });
                setTimeout(() => dispatch(loadHeight(true)), 1000);
            }
        });
}

export function switchChain(network, id) {
    return (dispatch) =>
        rpc.call('backend_switchChain', [network]).then((result) => {
            dispatch({
                type: 'NETWORK/SWITCH_CHAIN',
                network,
                id,
            });
            start();
        });
}
