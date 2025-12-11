import { useEffect, useRef, useState } from 'react';

import { RegisterState } from './registerState';
import { REGISTER_DEFINITIONS } from '../data/registers';

type UseRegisterStateResult = {
  state: RegisterState;
  version: number;
  ready: boolean;
};

export const useRegisterState = (): UseRegisterStateResult => {
  const stateRef = useRef<RegisterState | null>(null);
  const [version, setVersion] = useState(0);
  const [ready, setReady] = useState(false);

  if (!stateRef.current) {
    stateRef.current = new RegisterState(REGISTER_DEFINITIONS);
  }

  useEffect(() => {
    const state = stateRef.current;
    if (!state) return;
    state.initialize();
    setReady(true);
    setVersion((v) => v + 1);
    const unsub = state.subscribe(() => setVersion((v) => v + 1));
    return () => unsub?.();
  }, []);

  return { state: stateRef.current!, version, ready };
};
