import { Option } from '../types/register';

export const CLOSE_IN_RX_OPTIONS: Option[] = [
  { value: 0, desc: 'RX Attenuation: 0 dB' },
  { value: 1, desc: 'RX Attenuation: 6 dB' },
  { value: 2, desc: 'RX Attenuation: 12 dB' },
  { value: 3, desc: 'RX Attenuation: 18 dB' }
];

export const FIFO_THR_OPTIONS: Option[] = [
  { value: 0, desc: 'Bytes in TX FIFO: 61, Bytes in RX FIFO: 4' },
  { value: 1, desc: 'Bytes in TX FIFO: 57, Bytes in RX FIFO: 8' },
  { value: 2, desc: 'Bytes in TX FIFO: 53, Bytes in RX FIFO: 12' },
  { value: 3, desc: 'Bytes in TX FIFO: 49, Bytes in RX FIFO: 16' },
  { value: 4, desc: 'Bytes in TX FIFO: 45, Bytes in RX FIFO: 20' },
  { value: 5, desc: 'Bytes in TX FIFO: 41, Bytes in RX FIFO: 24' },
  { value: 6, desc: 'Bytes in TX FIFO: 37, Bytes in RX FIFO: 28' },
  { value: 7, desc: 'Bytes in TX FIFO: 33, Bytes in RX FIFO: 32' },
  { value: 8, desc: 'Bytes in TX FIFO: 29, Bytes in RX FIFO: 36' },
  { value: 9, desc: 'Bytes in TX FIFO: 25, Bytes in RX FIFO: 40' },
  { value: 10, desc: 'Bytes in TX FIFO: 21, Bytes in RX FIFO: 44' },
  { value: 11, desc: 'Bytes in TX FIFO: 17, Bytes in RX FIFO: 48' },
  { value: 12, desc: 'Bytes in TX FIFO: 13, Bytes in RX FIFO: 52' },
  { value: 13, desc: 'Bytes in TX FIFO: 9, Bytes in RX FIFO: 56' },
  { value: 14, desc: 'Bytes in TX FIFO: 5, Bytes in RX FIFO: 60' },
  { value: 15, desc: 'Bytes in TX FIFO: 1, Bytes in RX FIFO: 64' }
];

export const ADR_CHK_OPTIONS: Option[] = [
  { value: 0, desc: 'No address check' },
  { value: 1, desc: 'Address check, no broadcast' },
  { value: 2, desc: 'Address check and 0 (0x00) broadcast' },
  { value: 3, desc: 'Address check and 0 (0x00) and 255 (0xFF) broadcast' }
];

export const PKT_FORMAT_OPTIONS: Option[] = [
  { value: 0, desc: 'Normal mode; use FIFOs for RX and TX' },
  {
    value: 1,
    desc: 'Synchronous serial mode; Data in on GDO0 and data out on either of the GDOx pins'
  },
  {
    value: 2,
    desc: 'Random TX mode; sends random data using PN9 generator. Used for test. Works as normal mode (setting 0 (00)) in RX'
  },
  { value: 3, desc: 'Asynchronous serial mode; Data in on GDO0 and data out on either of the GDOx pins' }
];

export const LENGTH_CONFIG_OPTIONS: Option[] = [
  { value: 0, desc: 'Fixed packet length mode. Length configured in PKTLEN register' },
  {
    value: 1,
    desc: 'Variable packet length mode. Packet length configured by the first byte after sync word'
  },
  { value: 2, desc: 'Infinite packet length mode' },
  { value: 3, desc: 'Reserved' }
];

export const MOD_FORMAT_OPTIONS: Option[] = [
  { value: 0, desc: '2-FSK' },
  { value: 1, desc: 'GFSK' },
  { value: 2, desc: '—' },
  { value: 3, desc: 'ASK/OOK' },
  { value: 4, desc: '4-FSK' },
  { value: 5, desc: '—' },
  { value: 6, desc: '—' },
  { value: 7, desc: 'MSK (only supported for data rates above 26 kBaud)' }
];

export const SYNC_MODE_OPTIONS: Option[] = [
  { value: 0, desc: 'No preamble/sync' },
  { value: 1, desc: '15/16 sync word bits detected' },
  { value: 2, desc: '16/16 sync word bits detected' },
  { value: 3, desc: '30/32 sync word bits detected' },
  { value: 4, desc: 'No preamble/sync, carrier-sense above threshold' },
  { value: 5, desc: '15/16 + carrier-sense above threshold' },
  { value: 6, desc: '16/16 + carrier-sense above threshold' },
  { value: 7, desc: '30/32 + carrier-sense above threshold' }
];

export const NUM_PREAMBLE_OPTIONS: Option[] = [
  { value: 0, desc: 'Number of preamble bytes: 2' },
  { value: 1, desc: 'Number of preamble bytes: 3' },
  { value: 2, desc: 'Number of preamble bytes: 4' },
  { value: 3, desc: 'Number of preamble bytes: 6' },
  { value: 4, desc: 'Number of preamble bytes: 8' },
  { value: 5, desc: 'Number of preamble bytes: 12' },
  { value: 6, desc: 'Number of preamble bytes: 16' },
  { value: 7, desc: 'Number of preamble bytes: 24' }
];

export const CCA_MODE_OPTIONS: Option[] = [
  { value: 0, desc: 'Always' },
  { value: 1, desc: 'If RSSI below threshold' },
  { value: 2, desc: 'Unless currently receiving a packet' },
  { value: 3, desc: 'If RSSI below threshold unless currently receiving a packet' }
];

export const RXOFF_MODE_OPTIONS: Option[] = [
  { value: 0, desc: 'IDLE' },
  { value: 1, desc: 'FSTXON' },
  { value: 2, desc: 'TX' },
  { value: 3, desc: 'Stay in RX' }
];

export const TXOFF_MODE_OPTIONS: Option[] = [
  { value: 0, desc: 'IDLE' },
  { value: 1, desc: 'FSTXON' },
  { value: 2, desc: 'Stay in TX (start sending preamble)' },
  { value: 3, desc: 'RX' }
];

export const FS_AUTOCAL_OPTIONS: Option[] = [
  { value: 0, desc: 'Never (manual calibration using SCAL strobe)' },
  { value: 1, desc: 'When going from IDLE to RX or TX (or FSTXON)' },
  { value: 2, desc: 'When going from RX or TX back to IDLE automatically' },
  { value: 3, desc: 'Every 4th time when going from RX or TX to IDLE automatically' }
];

export const PO_TIMEOUT_OPTIONS: Option[] = [
  {
    value: 0,
    desc: 'Expire count: 1, Timeout after XOSC start: Approx. 2.3 – 2.4 µs'
  },
  {
    value: 1,
    desc: 'Expire count: 16, Timeout after XOSC start: Approx. 37 – 39 µs'
  },
  {
    value: 2,
    desc: 'Expire count: 64, Timeout after XOSC start: Approx. 149 – 155 µs'
  },
  {
    value: 3,
    desc: 'Expire count: 256, Timeout after XOSC start: Approx. 597 – 620 µs'
  }
];

export const FOC_PRE_K_OPTIONS: Option[] = [
  { value: 0, desc: 'K' },
  { value: 1, desc: '2K' },
  { value: 2, desc: '3K' },
  { value: 3, desc: '4K' }
];

export const FOC_LIMIT_OPTIONS: Option[] = [
  { value: 0, desc: '±0 (no frequency offset compensation)' },
  { value: 1, desc: '±BW_CHAN / 8' },
  { value: 2, desc: '±BW_CHAN / 4' },
  { value: 3, desc: '±BW_CHAN / 2' }
];

export const BS_PRE_KI_OPTIONS: Option[] = [
  { value: 0, desc: 'K_I' },
  { value: 1, desc: '2K_I' },
  { value: 2, desc: '3K_I' },
  { value: 3, desc: '4K_I' }
];

export const BS_PRE_KP_OPTIONS: Option[] = [
  { value: 0, desc: 'K_P' },
  { value: 1, desc: '2K_P' },
  { value: 2, desc: '3K_P' },
  { value: 3, desc: '4K_P' }
];

export const BS_LIMIT_OPTIONS: Option[] = [
  { value: 0, desc: '±0 (no offset compensation)' },
  { value: 1, desc: '±3.125% data rate offset' },
  { value: 2, desc: '±6.25% data rate offset' },
  { value: 3, desc: '±12.5% data rate offset' }
];

export const MAX_DVGA_GAIN_OPTIONS: Option[] = [
  { value: 0, desc: 'All gain settings can be used' },
  { value: 1, desc: 'The highest gain setting cannot be used' },
  { value: 2, desc: 'The 2 highest gain settings cannot be used' },
  { value: 3, desc: 'The 3 highest gain settings cannot be used' }
];

export const MAX_LNA_GAIN_OPTIONS: Option[] = [
  { value: 0, desc: 'Maximum possible LNA + LNA 2 gain' },
  { value: 1, desc: 'Approx. 2.6 dB below maximum possible gain' },
  { value: 2, desc: 'Approx. 6.1 dB below maximum possible gain' },
  { value: 3, desc: 'Approx. 7.4 dB below maximum possible gain' },
  { value: 4, desc: 'Approx. 9.2 dB below maximum possible gain' },
  { value: 5, desc: 'Approx. 11.5 dB below maximum possible gain' },
  { value: 6, desc: 'Approx. 14.6 dB below maximum possible gain' },
  { value: 7, desc: 'Approx. 17.1 dB below maximum possible gain' }
];

export const MAGN_TARGET_OPTIONS: Option[] = [
  { value: 0, desc: '24 dB' },
  { value: 1, desc: '27 dB' },
  { value: 2, desc: '30 dB' },
  { value: 3, desc: '33 dB' },
  { value: 4, desc: '36 dB' },
  { value: 5, desc: '38 dB' },
  { value: 6, desc: '40 dB' },
  { value: 7, desc: '42 dB' }
];

export const CARRIER_SENSE_REL_THR_OPTIONS: Option[] = [
  { value: 0, desc: 'Relative carrier sense threshold disabled' },
  { value: 1, desc: '6 dB increase in RSSI value' },
  { value: 2, desc: '10 dB increase in RSSI value' },
  { value: 3, desc: '14 dB increase in RSSI value' }
];

export const CARRIER_SENSE_ABS_THR_OPTIONS: Option[] = [
  { value: 8, desc: 'Absolute carrier sense threshold disabled' },
  { value: 9, desc: '7 dB below MAGN_TARGET setting' },
  { value: 10, desc: '6 dB below MAGN_TARGET setting' },
  { value: 11, desc: '5 dB below MAGN_TARGET setting' },
  { value: 12, desc: '4 dB below MAGN_TARGET setting' },
  { value: 13, desc: '3 dB below MAGN_TARGET setting' },
  { value: 14, desc: '2 dB below MAGN_TARGET setting' },
  { value: 15, desc: '1 dB below MAGN_TARGET setting' },
  { value: 0, desc: 'At MAGN_TARGET setting' },
  { value: 1, desc: '1 dB above MAGN_TARGET setting' },
  { value: 2, desc: '2 dB above MAGN_TARGET setting' },
  { value: 3, desc: '3 dB above MAGN_TARGET setting' },
  { value: 4, desc: '4 dB above MAGN_TARGET setting' },
  { value: 5, desc: '5 dB above MAGN_TARGET setting' },
  { value: 6, desc: '6 dB above MAGN_TARGET setting' },
  { value: 7, desc: '7 dB above MAGN_TARGET setting' }
];

export const HYST_LEVEL_OPTIONS: Option[] = [
  { value: 0, desc: 'No hysteresis, small symmetric dead zone, high gain' },
  { value: 1, desc: 'Low hysteresis, small asymmetric dead zone, medium gain' },
  { value: 2, desc: 'Medium hysteresis, medium asymmetric dead zone, medium gain' },
  { value: 3, desc: 'Large hysteresis, large asymmetric dead zone, low gain' }
];

export const WAIT_TIME_OPTIONS: Option[] = [
  { value: 0, desc: '8 channel filter samples' },
  { value: 1, desc: '16 channel filter samples' },
  { value: 2, desc: '24 channel filter samples' },
  { value: 3, desc: '32 channel filter samples' }
];

export const AGC_FREEZE_OPTIONS: Option[] = [
  { value: 0, desc: 'Normal operation; adjust gain whenever needed' },
  { value: 1, desc: 'Freeze gain when a sync word has been found' },
  { value: 2, desc: 'Manually freeze analogue gain; adjust digital gain' },
  { value: 3, desc: 'Freeze both analogue and digital gain; manual override' }
];

export const FILTER_LENGTH_OPTIONS: Option[] = [
  { value: 0, desc: '8 channel filter samples / 4 dB OOK/ASK decision boundary' },
  { value: 1, desc: '16 channel filter samples / 8 dB OOK/ASK decision boundary' },
  { value: 2, desc: '32 channel filter samples / 12 dB OOK/ASK decision boundary' },
  { value: 3, desc: '64 channel filter samples / 16 dB OOK/ASK decision boundary' }
];

export const EVENT1_OPTIONS: Option[] = [
  { value: 0, desc: '4 RC clock periods (0.111 – 0.115 ms)' },
  { value: 1, desc: '6 RC clock periods (0.167 – 0.173 ms)' },
  { value: 2, desc: '8 RC clock periods (0.222 – 0.230 ms)' },
  { value: 3, desc: '12 RC clock periods (0.333 – 0.346 ms)' },
  { value: 4, desc: '16 RC clock periods (0.444 – 0.462 ms)' },
  { value: 5, desc: '24 RC clock periods (0.667 – 0.692 ms)' },
  { value: 6, desc: '32 RC clock periods (0.889 – 0.923 ms)' },
  { value: 7, desc: '48 RC clock periods (1.333 – 1.385 ms)' }
];

export const WOR_RES_OPTIONS: Option[] = [
  {
    value: 0,
    desc: 'Resolution: 1 period (28–29 µs), Max timeout: 1.8 – 1.9 seconds'
  },
  {
    value: 1,
    desc: 'Resolution: 2^5 periods (0.89–0.92 ms), Max timeout: 58 – 61 seconds'
  },
  {
    value: 2,
    desc: 'Resolution: 2^10 periods (28–30 ms), Max timeout: 31 – 32 minutes'
  },
  {
    value: 3,
    desc: 'Resolution: 2^15 periods (0.91–0.94 s), Max timeout: 16.5 – 17.2 hours'
  }
];

export const PATABLE_868_OPTIONS: Option[] = [
  { value: 0xC0, desc: '10.7 dBm (34.2 mA)' },
  { value: 0xC1, desc: '10.3 dBm (33.3 mA)' },
  { value: 0xC2, desc: '10.0 dBm (32.4 mA)' },
  { value: 0xC3, desc: '9.6 dBm (31.6 mA)' },
  { value: 0xC4, desc: '9.2 dBm (30.9 mA)' },
  { value: 0xC5, desc: '8.9 dBm (30.2 mA)' },
  { value: 0xC6, desc: '8.5 dBm (29.5 mA)' },
  { value: 0xC7, desc: '8.2 dBm (28.9 mA)' },
  { value: 0xC8, desc: '7.8 dBm (28.3 mA)' },
  { value: 0xC9, desc: '7.5 dBm (27.8 mA)' },
  { value: 0xCA, desc: '7.2 dBm (27.3 mA)' },
  { value: 0xCB, desc: '6.8 dBm (26.8 mA)' },
  { value: 0xCC, desc: '6.5 dBm (26.3 mA)' },
  { value: 0xCD, desc: '6.2 dBm (25.9 mA)' },
  { value: 0xCE, desc: '5.5 dBm (25.0 mA)' },
  { value: 0x80, desc: '5.2 dBm (21.2 mA)' },
  { value: 0x81, desc: '5.0 dBm (21.0 mA)' },
  { value: 0x82, desc: '4.8 dBm (20.8 mA)' },
  { value: 0x83, desc: '4.6 dBm (20.5 mA)' },
  { value: 0x84, desc: '4.4 dBm (20.3 mA)' },
  { value: 0x85, desc: '4.1 dBm (20.0 mA)' },
  { value: 0x86, desc: '3.7 dBm (19.7 mA)' },
  { value: 0x87, desc: '3.4 dBm (19.5 mA)' },
  { value: 0x88, desc: '3.0 dBm (19.1 mA)' },
  { value: 0x89, desc: '2.6 dBm (18.8 mA)' },
  { value: 0xCF, desc: '2.4 dBm (22.0 mA)' },
  { value: 0x8A, desc: '2.1 dBm (18.5 mA)' },
  { value: 0x8B, desc: '1.7 dBm (18.2 mA)' },
  { value: 0x8C, desc: '1.1 dBm (17.9 mA)' },
  { value: 0x8D, desc: '0.6 dBm (17.6 mA)' },
  { value: 0x50, desc: '-0.3 dBm (16.9 mA)' },
  { value: 0x60, desc: '-0.5 dBm (16.8 mA)' },
  { value: 0x8E, desc: '-0.5 dBm (17.0 mA)' },
  { value: 0x51, desc: '-0.9 dBm (16.5 mA)' },
  { value: 0x61, desc: '-1.1 dBm (16.4 mA)' },
  { value: 0x40, desc: '-1.5 dBm (16.1 mA)' },
  { value: 0x52, desc: '-1.6 dBm (16.1 mA)' },
  { value: 0x62, desc: '-1.8 dBm (16.0 mA)' },
  { value: 0x53, desc: '-2.3 dBm (15.7 mA)' },
  { value: 0x63, desc: '-2.4 dBm (15.6 mA)' },
  { value: 0x3F, desc: '-2.6 dBm (21.4 mA)' },
  { value: 0x3E, desc: '-2.8 dBm (20.8 mA)' },
  { value: 0x54, desc: '-2.9 dBm (15.3 mA)' },
  { value: 0x64, desc: '-3.1 dBm (15.3 mA)' },
  { value: 0x3D, desc: '-3.2 dBm (20.2 mA)' },
  { value: 0x3C, desc: '-3.5 dBm (19.6 mA)' },
  { value: 0x55, desc: '-3.6 dBm (15.0 mA)' },
  { value: 0x65, desc: '-3.7 dBm (15.0 mA)' },
  { value: 0x3B, desc: '-4.0 dBm (19.0 mA)' },
  { value: 0x56, desc: '-4.2 dBm (14.7 mA)' },
  { value: 0x66, desc: '-4.4 dBm (14.7 mA)' },
  { value: 0x2F, desc: '-4.5 dBm (18.2 mA)' },
  { value: 0x3A, desc: '-4.5 dBm (18.4 mA)' },
  { value: 0x57, desc: '-4.8 dBm (14.5 mA)' },
  { value: 0x2E, desc: '-4.9 dBm (17.8 mA)' },
  { value: 0x67, desc: '-5.0 dBm (14.4 mA)' },
  { value: 0x39, desc: '-5.2 dBm (17.8 mA)' },
  { value: 0x2D, desc: '-5.5 dBm (17.4 mA)' },
  { value: 0x68, desc: '-5.7 dBm (14.2 mA)' },
  { value: 0x8F, desc: '-6.0 dBm (15.0 mA)' },
  { value: 0x2C, desc: '-6.0 dBm (17.0 mA)' },
  { value: 0x38, desc: '-6.1 dBm (17.1 mA)' },
  { value: 0x69, desc: '-6.3 dBm (14.0 mA)' },
  { value: 0x2B, desc: '-6.7 dBm (16.6 mA)' },
  { value: 0x6A, desc: '-6.9 dBm (13.8 mA)' },
  { value: 0x37, desc: '-6.9 dBm (16.4 mA)' },
  { value: 0x2A, desc: '-7.4 dBm (16.2 mA)' },
  { value: 0x6B, desc: '-7.5 dBm (13.8 mA)' },
  { value: 0x36, desc: '-8.1 dBm (15.8 mA)' },
  { value: 0x29, desc: '-8.2 dBm (15.8 mA)' },
  { value: 0x6C, desc: '-8.7 dBm (14.0 mA)' },
  { value: 0x28, desc: '-9.0 dBm (15.4 mA)' },
  { value: 0x35, desc: '-9.4 dBm (15.2 mA)' },
  { value: 0x27, desc: '-9.8 dBm (15.0 mA)' },
  { value: 0x26, desc: '-11.0 dBm (14.6 mA)' },
  { value: 0x34, desc: '-11.1 dBm (14.6 mA)' },
  { value: 0x25, desc: '-12.5 dBm (14.1 mA)' },
  { value: 0x33, desc: '-13.3 dBm (14.0 mA)' },
  { value: 0x24, desc: '-14.3 dBm (13.7 mA)' },
  { value: 0x6D, desc: '-14.5 dBm (14.7 mA)' },
  { value: 0x1F, desc: '-14.6 dBm (13.5 mA)' },
  { value: 0x1E, desc: '-15.1 dBm (13.4 mA)' },
  { value: 0x1D, desc: '-15.7 dBm (13.3 mA)' },
  { value: 0x1C, desc: '-16.4 dBm (13.2 mA)' },
  { value: 0x23, desc: '-16.5 dBm (13.3 mA)' },
  { value: 0x32, desc: '-16.5 dBm (13.4 mA)' },
  { value: 0x1B, desc: '-17.0 dBm (13.1 mA)' },
  { value: 0x1A, desc: '-17.8 dBm (13.0 mA)' },
  { value: 0x19, desc: '-18.6 dBm (12.9 mA)' },
  { value: 0x18, desc: '-19.5 dBm (12.8 mA)' },
  { value: 0x22, desc: '-19.6 dBm (12.9 mA)' },
  { value: 0x0F, desc: '-20.0 dBm (12.7 mA)' },
  { value: 0x0E, desc: '-20.5 dBm (12.7 mA)' },
  { value: 0x17, desc: '-20.5 dBm (12.7 mA)' },
  { value: 0x0D, desc: '-21.1 dBm (12.6 mA)' },
  { value: 0x0C, desc: '-21.7 dBm (12.6 mA)' },
  { value: 0x16, desc: '-21.7 dBm (12.6 mA)' },
  { value: 0x31, desc: '-21.9 dBm (12.8 mA)' },
  { value: 0x0B, desc: '-22.3 dBm (12.5 mA)' },
  { value: 0x0A, desc: '-23.0 dBm (12.5 mA)' },
  { value: 0x15, desc: '-23.0 dBm (12.5 mA)' },
  { value: 0x09, desc: '-23.8 dBm (12.4 mA)' },
  { value: 0x08, desc: '-24.6 dBm (12.3 mA)' },
  { value: 0x14, desc: '-24.7 dBm (12.4 mA)' },
  { value: 0x21, desc: '-24.8 dBm (12.5 mA)' },
  { value: 0x07, desc: '-25.5 dBm (12.3 mA)' },
  { value: 0x13, desc: '-26.5 dBm (12.3 mA)' },
  { value: 0x06, desc: '-26.5 dBm (12.2 mA)' },
  { value: 0x05, desc: '-27.7 dBm (12.2 mA)' },
  { value: 0x12, desc: '-28.9 dBm (12.2 mA)' },
  { value: 0x04, desc: '-28.9 dBm (12.1 mA)' },
  { value: 0x03, desc: '-30.2 dBm (12.1 mA)' },
  { value: 0x02, desc: '-31.7 dBm (12.0 mA)' },
  { value: 0x11, desc: '-31.7 dBm (12.1 mA)' },
  { value: 0x01, desc: '-33.1 dBm (12.0 mA)' },
  { value: 0x10, desc: '-34.1 dBm (11.9 mA)' },
  { value: 0x20, desc: '-34.1 dBm (12.1 mA)' },
  { value: 0x30, desc: '-34.2 dBm (12.2 mA)' },
  { value: 0x6E, desc: '-45.8 dBm (16.1 mA)' },
  { value: 0x00, desc: '-59.3 dBm (11.3 mA)' },
  { value: 0x6F, desc: '-69.2 dBm (10.8 mA)' }
];

export const PATABLE_915_OPTIONS: Option[] = [
  { value: 0x03, desc: '-30 dBm' },
  { value: 0x0E, desc: '-20 dBm' },
  { value: 0x1E, desc: '-15 dBm' },
  { value: 0x27, desc: '-10 dBm' },
  { value: 0x38, desc: '-6 dBm' },
  { value: 0x8E, desc: '0 dBm' },
  { value: 0x84, desc: '5 dBm' },
  { value: 0xCC, desc: '7 dBm' },
  { value: 0xC3, desc: '10 dBm' },
  { value: 0xC6, desc: '8.9 dBm (default)' },
  { value: 0xC0, desc: '11 dBm' }
];

export const GDO_CFG_OPTIONS: Option[] = [
  {
    value: 0,
    desc: 'Associated to the RX FIFO: Asserts when RX FIFO is filled at or above the RX FIFO threshold. De-asserts when RX FIFO is drained below the same threshold.'
  },
  {
    value: 1,
    desc: 'Associated to the RX FIFO: Asserts when RX FIFO is filled at or above the RX FIFO threshold or the end of packet is received. De-asserts when the RX FIFO is empty.'
  },
  {
    value: 2,
    desc: 'Associated to the TX FIFO: Asserts when the TX FIFO is filled at or above the TX FIFO threshold. De-asserts when the TX FIFO is below the same threshold.'
  },
  {
    value: 3,
    desc: 'Associated to the TX FIFO: Asserts when TX FIFO is full. De-asserts when the TX FIFO is drained below the TX FIFO threshold.'
  },
  { value: 4, desc: 'Asserts when the RX FIFO has overflowed. De-asserts when the FIFO has been flushed.' },
  { value: 5, desc: 'Asserts when the TX FIFO has underflowed. De-asserts when the FIFO is flushed.' },
  {
    value: 6,
    desc: 'Asserts when sync word has been sent / received and de-asserts at the end of packet. In RX, the pin will also de-assert when a packet is discarded due to address or maximum length filtering or when the radio enters RX FIFO_OVERFLOW state. In TX the pin will de-assert if the TX FIFO underflows.'
  },
  { value: 7, desc: 'Asserts when a packet has been received with CRC OK. De-asserts when the first byte is read from the RX FIFO.' },
  {
    value: 8,
    desc: 'Preamble Quality Reached. Asserts when the PQI is above the programmed PQT value. De-asserted when chip re-enters RX state (MARCSTATE=0x0D) or the PQI gets below the programmed PQT value.'
  },
  { value: 9, desc: 'Clear channel assessment. High when RSSI level is below threshold (dependent on current CCA_MODE setting).' },
  {
    value: 10,
    desc: 'Lock detector output. The PLL is in lock if the lock detector output has a positive transition or is constantly logic high. To check PLL lock the lock detector output should be used as an interrupt for the MCU.'
  },
  { value: 11, desc: 'Serial Clock. Synchronous to the data in synchronous serial mode. In RX mode, data is set up on the falling edge by GDOx_INV=0. In TX mode, data is sampled by GDOx_INV=0 on the rising edge of the serial clock when GDOx_INV=0.' },
  { value: 12, desc: 'Serial Synchronous Data Output. Used for synchronous serial mode.' },
  { value: 13, desc: 'Serial Data Output. Used for asynchronous serial mode.' },
  { value: 14, desc: 'Carrier sense. High if RSSI level is above threshold. Cleared when entering IDLE mode.' },
  { value: 15, desc: 'CRC OK. The last CRC comparison matched. Cleared when entering/restarting RX mode.' },
  { value: 16, desc: 'Reserved – used for test' },
  { value: 17, desc: 'Reserved – used for test' },
  { value: 18, desc: 'RX_HARD_DATA[1]. Can be used together with RX_SYMBOL_TICK for alternative serial RX output.' },
  { value: 19, desc: 'Reserved — used for test' },
  { value: 20, desc: 'Reserved — used for test' },
  { value: 21, desc: 'Reserved — used for test' },
  { value: 22, desc: 'Reserved — used for test' },
  { value: 23, desc: 'RX_HARD_DATA[0]. Can be used together with RX_SYMBOL_TICK for alternative serial RX output.' },
  { value: 24, desc: 'Reserved — used for test' },
  { value: 25, desc: 'Reserved — used for test' },
  { value: 26, desc: 'Reserved — used for test' },
  {
    value: 27,
    desc: 'PA_PD. Note: PA_PD will have the same signal level in SLEEP and TX states. To control an external PA or RX/TX switch in applications where the SLEEP state is used it is recommended to use GDOx_CFGx = 0x2F instead.'
  },
  {
    value: 28,
    desc: 'LNA_PD. Note: LNA_PD will have the same signal level in SLEEP and RX states. To control an external LNA or RX/TX switch in applications where SLEEP state is used it is recommended to use GDOx_CFGx = 0x2F instead.'
  },
  { value: 29, desc: 'RX_SYMBOL_TICK. Can be used together with RX_HARD_DATA for alternative serial RX output.' },
  { value: 30, desc: 'Reserved — used for test' },
  { value: 31, desc: 'Reserved – used for test' },
  { value: 32, desc: 'Reserved – used for test' },
  { value: 33, desc: 'Reserved – used for test' },
  { value: 34, desc: 'Reserved – used for test' },
  { value: 35, desc: 'WOR_EVENT0' },
  { value: 36, desc: 'WOR_EVENT1' },
  { value: 37, desc: 'Reserved — used for test' },
  { value: 38, desc: 'CLK_256' },
  { value: 39, desc: 'CLK_32k' },
  { value: 40, desc: 'Reserved – used for test' },
  { value: 41, desc: 'CHIP_RDYn' },
  { value: 42, desc: 'Reserved – used for test' },
  { value: 43, desc: 'XOSC_STABLE' },
  { value: 44, desc: 'Reserved – used for test' },
  { value: 45, desc: 'Reserved – used for test' },
  { value: 46, desc: 'High impedance (3-state)' },
  {
    value: 47,
    desc: 'HW to 1 (HVI achieved by setting GDOx_INV=1). Can be used to control an external LNA/PA or RX/TX switch.'
  },
  { value: 48, desc: 'CLK_XOSC/1' },
  { value: 49, desc: 'CLK_XOSC/1.5' },
  { value: 50, desc: 'CLK_XOSC/2' },
  { value: 51, desc: 'CLK_XOSC/3' },
  { value: 52, desc: 'CLK_XOSC/4' },
  { value: 53, desc: 'CLK_XOSC/6' },
  { value: 54, desc: 'CLK_XOSC/8' },
  { value: 55, desc: 'CLK_XOSC/12' },
  { value: 56, desc: 'CLK_XOSC/16' },
  { value: 57, desc: 'CLK_XOSC/24' },
  { value: 58, desc: 'CLK_XOSC/32' },
  { value: 59, desc: 'CLK_XOSC/48' },
  { value: 60, desc: 'CLK_XOSC/64' },
  { value: 61, desc: 'CLK_XOSC/96' },
  { value: 62, desc: 'CLK_XOSC/128' },
  { value: 63, desc: 'CLK_XOSC/192' }
];
