import {
  ADR_CHK_OPTIONS,
  AGC_FREEZE_OPTIONS,
  BS_LIMIT_OPTIONS,
  BS_PRE_KI_OPTIONS,
  BS_PRE_KP_OPTIONS,
  CARRIER_SENSE_ABS_THR_OPTIONS,
  CARRIER_SENSE_REL_THR_OPTIONS,
  CCA_MODE_OPTIONS,
  CLOSE_IN_RX_OPTIONS,
  EVENT1_OPTIONS,
  FILTER_LENGTH_OPTIONS,
  FIFO_THR_OPTIONS,
  FOC_LIMIT_OPTIONS,
  FOC_PRE_K_OPTIONS,
  FS_AUTOCAL_OPTIONS,
  GDO_CFG_OPTIONS,
  HYST_LEVEL_OPTIONS,
  LENGTH_CONFIG_OPTIONS,
  MAGN_TARGET_OPTIONS,
  MAX_DVGA_GAIN_OPTIONS,
  MAX_LNA_GAIN_OPTIONS,
  MOD_FORMAT_OPTIONS,
  NUM_PREAMBLE_OPTIONS,
  PATABLE_868_OPTIONS,
  PATABLE_915_OPTIONS,
  PKT_FORMAT_OPTIONS,
  PO_TIMEOUT_OPTIONS,
  RXOFF_MODE_OPTIONS,
  SYNC_MODE_OPTIONS,
  TXOFF_MODE_OPTIONS,
  WAIT_TIME_OPTIONS,
  WOR_RES_OPTIONS
} from '../data/options';
import { RegisterCalculations } from '../logic/calculations';
import { FieldConfigMap, Option, RegisterValues } from '../types/register';

const formatHexOption = (option: Option) =>
  `${option.value} (0x${option.value.toString(16).padStart(2, '0').toUpperCase()})`;

const formatCarrierSenseAbs = (option: Option) => {
  const binaryValue = option.value.toString(2).padStart(4, '0');
  let signedDisplay = '';
  if (option.value === 8) {
    signedDisplay = '[-8]';
  } else if (option.value > 8) {
    signedDisplay = `[${option.value - 16}]`;
  } else {
    signedDisplay = `[${option.value >= 0 ? '+' : ''}${option.value}]`;
  }
  return `${option.value} (${binaryValue}) ${signedDisplay}`;
};

const resolvePatable = (registers: RegisterValues, crystalFreqMHz: number) => {
  const carrierHz = RegisterCalculations.carrierFrequency(registers, crystalFreqMHz);
  const carrierFreqMHz = carrierHz / 1e6;
  return carrierFreqMHz >= 890 ? PATABLE_915_OPTIONS : PATABLE_868_OPTIONS;
};

export const FIELD_CONFIGS: FieldConfigMap = {
  'GDO0_CFG[5:0]': {
    options: GDO_CFG_OPTIONS,
    scrollKey: 'gdo',
    valueFormatter: formatHexOption
  },
  'GDO1_CFG[5:0]': {
    options: GDO_CFG_OPTIONS,
    scrollKey: 'gdo',
    valueFormatter: formatHexOption
  },
  'GDO2_CFG[5:0]': {
    options: GDO_CFG_OPTIONS,
    scrollKey: 'gdo',
    valueFormatter: formatHexOption
  },
  'FIFO_THR[3:0]': {
    options: FIFO_THR_OPTIONS,
    scrollKey: 'fifo_thr'
  },
  'CLOSE_IN_RX[1:0]': {
    options: CLOSE_IN_RX_OPTIONS,
    scrollKey: 'close_in_rx'
  },
  'ADR_CHK[1:0]': {
    options: ADR_CHK_OPTIONS,
    scrollKey: 'adr_chk'
  },
  'PKT_FORMAT[1:0]': {
    options: PKT_FORMAT_OPTIONS,
    scrollKey: 'pkt_format'
  },
  'LENGTH_CONFIG[1:0]': {
    options: LENGTH_CONFIG_OPTIONS,
    scrollKey: 'length_config'
  },
  'MOD_FORMAT[2:0]': {
    options: MOD_FORMAT_OPTIONS,
    scrollKey: 'mod_format'
  },
  'SYNC_MODE[2:0]': {
    options: SYNC_MODE_OPTIONS,
    scrollKey: 'sync_mode'
  },
  'NUM_PREAMBLE[2:0]': {
    options: NUM_PREAMBLE_OPTIONS,
    scrollKey: 'num_preamble'
  },
  'CCA_MODE[1:0]': {
    options: CCA_MODE_OPTIONS,
    scrollKey: 'cca_mode'
  },
  'RXOFF_MODE[1:0]': {
    options: RXOFF_MODE_OPTIONS,
    scrollKey: 'rxoff_mode'
  },
  'TXOFF_MODE[1:0]': {
    options: TXOFF_MODE_OPTIONS,
    scrollKey: 'txoff_mode'
  },
  'FS_AUTOCAL[1:0]': {
    options: FS_AUTOCAL_OPTIONS,
    scrollKey: 'fs_autocal'
  },
  'PO_TIMEOUT[1:0]': {
    options: PO_TIMEOUT_OPTIONS,
    scrollKey: 'po_timeout'
  },
  'FOC_PRE_K[1:0]': {
    options: FOC_PRE_K_OPTIONS,
    scrollKey: 'foc_pre_k'
  },
  'FOC_LIMIT[1:0]': {
    options: FOC_LIMIT_OPTIONS,
    scrollKey: 'foc_limit'
  },
  'BS_PRE_KI[1:0]': {
    options: BS_PRE_KI_OPTIONS,
    scrollKey: 'bs_pre_ki'
  },
  'BS_PRE_KP[1:0]': {
    options: BS_PRE_KP_OPTIONS,
    scrollKey: 'bs_pre_kp'
  },
  'BS_LIMIT[1:0]': {
    options: BS_LIMIT_OPTIONS,
    scrollKey: 'bs_limit'
  },
  'MAX_DVGA_GAIN[1:0]': {
    options: MAX_DVGA_GAIN_OPTIONS,
    scrollKey: 'max_dvga_gain'
  },
  'MAX_LNA_GAIN[2:0]': {
    options: MAX_LNA_GAIN_OPTIONS,
    scrollKey: 'max_lna_gain'
  },
  'MAGN_TARGET[2:0]': {
    options: MAGN_TARGET_OPTIONS,
    scrollKey: 'magn_target'
  },
  'CARRIER_SENSE_REL_THR[1:0]': {
    options: CARRIER_SENSE_REL_THR_OPTIONS,
    scrollKey: 'carrier_sense_rel_thr'
  },
  'CARRIER_SENSE_ABS_THR[3:0]': {
    options: CARRIER_SENSE_ABS_THR_OPTIONS,
    scrollKey: 'carrier_sense_abs_thr',
    valueFormatter: formatCarrierSenseAbs
  },
  'HYST_LEVEL[1:0]': {
    options: HYST_LEVEL_OPTIONS,
    scrollKey: 'hyst_level'
  },
  'WAIT_TIME[1:0]': {
    options: WAIT_TIME_OPTIONS,
    scrollKey: 'wait_time'
  },
  'AGC_FREEZE[1:0]': {
    options: AGC_FREEZE_OPTIONS,
    scrollKey: 'agc_freeze'
  },
  'FILTER_LENGTH[1:0]': {
    options: FILTER_LENGTH_OPTIONS,
    scrollKey: 'filter_length'
  },
  'EVENT1[2:0]': {
    options: EVENT1_OPTIONS,
    scrollKey: 'event1'
  },
  'WOR_RES[1:0]': {
    options: WOR_RES_OPTIONS,
    scrollKey: 'wor_res'
  },
  'PATABLE[0]': {
    getOptions: resolvePatable,
    scrollKey: 'patable',
    valueFormatter: formatHexOption
  }
};
