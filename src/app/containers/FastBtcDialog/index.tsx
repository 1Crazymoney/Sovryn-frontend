/**
 *
 * FastBtcDialog
 *
 */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Classes, Overlay } from '@blueprintjs/core';
import classNames from 'classnames';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectFastBtcDialog } from './selectors';
import { fastBtcDialogSaga } from './saga';
import styles from './index.module.css';
import { Step } from './types';
import { MainScreen } from './components/MainScreen';
import { TransactionScreen } from './components/TransactionScreen';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function FastBtcDialog(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: fastBtcDialogSaga });

  const state = useSelector(selectFastBtcDialog);
  const dispatch = useDispatch();

  const handleOpening = useCallback(() => {
    dispatch(actions.init());
  }, [dispatch]);

  const handleClosing = useCallback(() => {
    dispatch(actions.reset());
  }, [dispatch]);

  return (
    <Overlay
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      onOpening={() => handleOpening()}
      onClosing={() => handleClosing()}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
      canOutsideClickClose
      canEscapeKeyClose
    >
      <div className="custom-dialog-container">
        <div
          className={classNames(
            'custom-dialog font-family-montserrat',
            styles.dialogContainer,
          )}
        >
          <div className={styles.container}>
            {[Step.MAIN, Step.WALLET].includes(state.step) && (
              <MainScreen state={state} dispatch={dispatch} />
            )}
            {state.step === Step.TRANSACTION && (
              <TransactionScreen
                state={state}
                dispatch={dispatch}
                onClose={() => props.onClose()}
              />
            )}
          </div>
        </div>
      </div>
    </Overlay>
  );
}
